"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "@/components/ActionCard";
import MeetingModal from "@/components/MeetingModal";
import MeetingCard from "@/components/MeetingCard";
import TimedLoader from "@/components/TimeLoader";
import { Loader2Icon } from "lucide-react";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();

  const [interviews, setInterviews] = useState<any[] | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  const [showLoader, setShowLoader] = useState(true);

  // Control the 2-second loader timer
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/interviews");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setInterviews(data);
      } catch (err) {
        console.error("Interview fetch failed:", err);
        setFetchError(true);
        setInterviews([]);
      }
    };

    if (isCandidate) {
      fetchInterviews();
    }
  }, [isCandidate]);

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  // Only show loader if either role or initial timer is still loading
  if (isLoading || showLoader) {
    return (
      <TimedLoader duration={2000}>
        <main className="p-8">
          <h1 className="text-3xl font-bold">Loading content...</h1>
        </main>
      </TimedLoader>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ed145c] to-[#cb3769] bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {/* Interviewer View */}
      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        // Candidate View
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">
              View and join your scheduled interviews
            </p>
          </div>

          <div className="mt-8">
            {interviews === null ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : fetchError ? (
              <div className="text-center py-12 text-destructive font-medium">
                Failed to load interviews. Please try again later.
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
