"use client";

import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

export default function ScheduleUI() {
  const { data: session, status } = useSession();
  const client = useStreamVideoClient();

  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  type Interview = {
    _id: string;
    title: string;
    description: string;
    startTime: number;
    status: string;
    streamCallId: string;
    candidateId: string;
    interviewerIds: string[];
    [key: string]: any;
  };
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  type User = {
    _id: string; // MongoDB uses _id
    id?: string; // Optional for compatibility
    role: "candidate" | "interviewer" | "admin";
    name: string;
    email: string;
    [key: string]: any;
  };
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch(`/api/users/byId?id=${session.user.id}`);
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    
    if (status === "authenticated") {
      fetchCurrentUser();
    }
  }, [status, session?.user?.id]);

  // Fetch users (only for interviewers/admins)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users in ScheduleUI:", err);
        toast.error("Failed to load users");
      }
    };
    
    if (status === "authenticated" && currentUser?.role !== "candidate") {
      fetchUsers();
    }
  }, [status, currentUser?.role]);

  // Fetch interviews with role-based filtering
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        let url = "/api/interviews";
        
        // If user is a candidate, only fetch their interviews
        if (currentUser?.role === "candidate") {
          url = `/api/interviews?candidateId=${session?.user?.id}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setInterviews(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load interviews");
      }
    };
    
    if (status === "authenticated" && currentUser) {
      fetchInterviews();
    }
  }, [status, currentUser, session?.user?.id]);

  const candidates = users?.filter((u) => u.role === "candidate") || [];
  const interviewers = users?.filter((u) => u.role === "interviewer") || [];

  // Debug logging
  console.log("Current user:", currentUser);
  console.log("All users:", users);
  console.log("Candidates:", candidates);
  console.log("Interviewers:", interviewers);

  // Helper function to get user ID - consistently use _id first, then fallback to id
  const getUserId = (user: User) => user._id || user.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: session?.user?.id ? [session.user.id] : [],
  });

  // Update formData when session changes
  useEffect(() => {
    if (session?.user?.id) {
      setFormData(prev => ({
        ...prev,
        interviewerIds:
          prev.interviewerIds.length === 0 && session.user.id
            ? [session.user.id]
            : prev.interviewerIds.filter((id): id is string => typeof id === "string" && !!id)
      }));
    }
  }, [session?.user?.id]);

  const scheduleMeeting = async () => {
    if (!client || !session?.user) return;

    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      const res = await fetch("/api/interviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startTime: meetingDate.getTime(),
          status: "upcoming",
          streamCallId: id,
          candidateId,
          interviewerIds,
        }),
      });

      if (!res.ok) throw new Error("Interview creation failed");

      const newInterview = await res.json();
      setInterviews((prev) => [...prev, newInterview]);

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: session?.user?.id ? [session.user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === session?.user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  // Fix: Use consistent ID checking for both selected and available interviewers
  const selectedInterviewers = interviewers.filter((i) => {
    const userId = getUserId(i);
    return userId && formData.interviewerIds.includes(userId);
  });

  const availableInterviewers = interviewers.filter((i) => {
    const userId = getUserId(i);
    return userId && !formData.interviewerIds.includes(userId);
  });

  // Show loading if session is still loading
  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  // Show loading if current user is not loaded yet
  if (!currentUser) {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Check if user can schedule interviews
  const canSchedule = currentUser.role === "interviewer" || currentUser.role === "admin";

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {currentUser.role === "candidate" ? "My Interviews" : "Interviews"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentUser.role === "candidate" 
              ? "View your scheduled interviews" 
              : "Schedule and manage interviews"
            }
          </p>
        </div>

        {canSchedule && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" size="lg">Schedule Interview</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
              <DialogHeader>
                <DialogTitle>Schedule Interview</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Interview title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Interview description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidate</label>
                  <Select
                    value={formData.candidateId}
                    onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No candidates found</div>
                      ) : (
                        candidates
                          .filter(candidate => getUserId(candidate)) // Filter out candidates without valid IDs
                          .map((candidate, index) => (
                            <SelectItem 
                              key={getUserId(candidate) || `candidate-${index}`} 
                              value={getUserId(candidate) ?? ""}
                            >
                              <UserInfo
                                user={{
                                  ...candidate,
                                }}
                              />
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interviewers</label>
                  
                  {/* Display selected interviewers */}
                  {selectedInterviewers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedInterviewers.map((interviewer, index) => (
                        <div
                          key={`selected-${getUserId(interviewer) || index}`}
                          className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                        >
                          <UserInfo
                            user={{
                              ...interviewer,
                            }}
                          />
                          {getUserId(interviewer) !== session?.user?.id && getUserId(interviewer) && (
                            <button
                              onClick={() => removeInterviewer(getUserId(interviewer)!)}
                              className="hover:text-destructive transition-colors cursor-pointer"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interviewer selection dropdown - always visible */}
                  <Select onValueChange={addInterviewer} value="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No available interviewers</div>
                      ) : (
                        availableInterviewers
                          .filter(interviewer => getUserId(interviewer)) // Filter out interviewers without valid IDs
                          .map((interviewer, index) => (
                            <SelectItem 
                              key={`available-${getUserId(interviewer) || index}`} 
                              value={getUserId(interviewer) ?? ""}
                            >
                              <UserInfo
                                user={{
                                  ...interviewer,
                                }}
                              />
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Select
                      value={formData.time}
                      onValueChange={(time) => setFormData({ ...formData, time })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="cursor-pointer" onClick={scheduleMeeting} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Schedule Interview"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Role-based message for candidates */}
      {currentUser.role === "candidate" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can view your scheduled interviews here. New interviews will be scheduled by interviewers.
            </p>
          </div>
        </div>
      )}

      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard
                key={interview._id}
                interview={{
                  ...interview,
                  startTime: interview.startTime,
                  status: (
                    ["pending", "live", "completed", "failed", "succeeded"].includes(interview.status)
                      ? interview.status
                      : "pending"
                  ) as "pending" | "live" | "completed" | "failed" | "succeeded",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {currentUser.role === "candidate" 
            ? "No interviews scheduled for you yet" 
            : "No interviews scheduled"
          }
        </div>
      )}
    </div>
  );
}