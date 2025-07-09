"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

function MeetingPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { call, isCallLoading } = useGetCallById(typeof id === "string" ? id : "");

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === "loading" || isCallLoading) return <LoaderUI />;

  if (!session?.user || !call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}
export default MeetingPage;
