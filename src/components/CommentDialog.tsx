"use client";

import { useEffect, useState } from "react";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { IUser } from "@/models/user";
import { IComment } from "@/models/comment";

function getInitials(name: string = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function CommentDialog({ interviewId }: { interviewId: string }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("3");

  const [users, setUsers] = useState<IUser[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  // const [loading, setLoading] = useState(true);

  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchData = async () => {

      try {
        const [userRes, commentRes] = await Promise.all([
          fetch("/api/users"),
          fetch(`/api/comments?interviewId=${interviewId}`),
        ]);

        const usersData = await userRes.json();
        const commentsData = await commentRes.json();

        setUsers(usersData);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load comments or users");
      } finally {
        // setLoading(false);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, interviewId]);

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter comment");
    if (!currentUserId) return toast.error("You must be signed in to comment");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          content: comment.trim(),
          rating: parseInt(rating),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);

      toast.success("Comment submitted");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      console.log("Failed to submit comment: ",error);
      toast.error("Failed to submit comment");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-4 w-4 ${starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );

  const getInterviewerInfo = (userId: string) => {
    const user = users.find((u) => u.id === userId); // fallback for legacy data
    return {
      name: user?.name || "Unknown",
      image: user?.image || "",
      initials: getInitials(user?.name),
    };
  };

  // Don't return null - always render the button
  if (status === "loading") {
    return (
      <Button variant="secondary" className="cursor-pointer w-full" disabled>
        <MessageSquareIcon className="h-4 w-4 mr-2" />
        Add Comment
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="cursor-pointer w-full bg-secondary/80 hover:bg-secondary border border-border"
        >
          <MessageSquareIcon className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Interview Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {comments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Previous Comments</h4>
                <Badge variant="outline">
                  {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <ScrollArea className="h-[240px]">
                <div className="space-y-4">
                  {comments.map((comment, index) => {
                    const interviewer = getInterviewerInfo(comment.interviewerId);
                    return (
                      <div key={index} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interviewer.image} />
                              <AvatarFallback>{interviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{interviewer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(comment.createdAt), "MMM d, yyyy • h:mm a")}
                              </p>
                            </div>
                          </div>
                          {renderStars(comment.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem className="cursor-pointer" key={value} value={value.toString()}>
                      <div className="flex items-center gap-2">{renderStars(value)}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Your Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed comment about the candidate..."
                className="h-32"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;