"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
import { IInterview } from "@/models/interview";
import { IUser } from "@/models/user";

function DashboardPage() {
  const [interviews, setInterviews] = useState<IInterview[] | null>(null);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, interviewsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/interviews"),
        ]);
        if (!usersRes.ok || !interviewsRes.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const usersData = await usersRes.json();
        const interviewData = await interviewsRes.json();

        setUsers(usersData);
        setInterviews(interviewData);
      } catch (err) {
        console.error("Error in line 46 of DashboardPage", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleStatusUpdate = async (interviewId: string, status: string) => {
    try {
      const res = await fetch("/api/interviews/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: interviewId, status }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();

      setInterviews((prev) =>
        prev?.map((int) => (int._id === interviewId ? updated : int)) || []
      );
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      console.error("Error updating interview status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading || !interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button>Schedule New Interview</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant={category.variant}>
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterviews[category.id].map((interview: IInterview) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);

                    return (
                      <Card key={String(interview._id)} className="hover:shadow-md transition-all">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback>{candidateInfo.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{candidateInfo.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(startTime, "MMM dd")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {format(startTime, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                className="flex-1"
                                onClick={() => handleStatusUpdate(String(interview._id), "succeeded")}
                              >
                                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleStatusUpdate(String(interview._id), "failed")}
                              >
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}
                          <CommentDialog interviewId={String(interview._id)} />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
