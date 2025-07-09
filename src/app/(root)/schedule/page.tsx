"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ScheduleUI from "./ScheduleUI";

function SchedulePage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();

  // Handle navigation in useEffect to avoid calling router.push during render
  useEffect(() => {
    if (!isLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isLoading, isInterviewer, router]);

  if (isLoading) return <LoaderUI />;
  if (!isInterviewer) return <LoaderUI />; // Show loader while redirecting

  return <ScheduleUI />;
}

export default SchedulePage;