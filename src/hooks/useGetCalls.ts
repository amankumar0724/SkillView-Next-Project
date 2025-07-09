// ✅ useGetCalls.ts
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const useGetCalls = () => {
  const { data: session, status } = useSession();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || status !== "authenticated" || !session?.user?.id) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: session.user.id },
              { members: { $in: [session.user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error("Error loading calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, session?.user?.id, status]);

  const now = new Date();

  const endedCalls = useMemo(() => calls?.filter(({ state: { startsAt, endedAt } }) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  }), [calls]);

  const upcomingCalls = useMemo(() => calls?.filter(({ state: { startsAt } }) => {
    return startsAt && new Date(startsAt) > now;
  }), [calls]);

  const liveCalls = useMemo(() => calls?.filter(({ state: { startsAt, endedAt } }) => {
    return startsAt && new Date(startsAt) < now && !endedAt;
  }), [calls]);

  return { calls, endedCalls, upcomingCalls, liveCalls, isLoading };
};

export default useGetCalls;
