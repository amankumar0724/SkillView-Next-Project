"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isMeetingOwner = localParticipant?.userId === call?.state.createdBy?.id;

  // Fetch interview by Stream Call ID
  useEffect(() => {
    const fetchInterview = async () => {
      if (!call?.id) return;

      try {
        const res = await fetch(`/api/interviews/stream?streamCallId=${call.id}`);
        const data = await res.json();

        if (res.ok && data?._id) {
          setInterviewId(data._id);
        } else {
          toast.error("Interview not found");
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Unable to load interview");
      }
    };

    fetchInterview();
  }, [call?.id]);

  // End call and update interview status
  const endCall = async () => {
    if (!call || !interviewId) return;

    try {
      setLoading(true);

      await call.endCall();

      const res = await fetch("/api/interviews/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: interviewId,
          status: "completed",
        }),
      });

      if (!res.ok) throw new Error("Failed to update interview status");

      toast.success("Meeting ended for everyone");
      router.push("/");
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Failed to end meeting");
    } finally {
      setLoading(false);
    }
  };

  if (!call || !isMeetingOwner || !interviewId) return null;

  return (
    <Button variant="destructive" onClick={endCall} disabled={loading}>
      {loading ? "Ending..." : "End Meeting"}
    </Button>
  );
}

export default EndCallButton;
