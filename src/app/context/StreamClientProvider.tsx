"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { streamTokenProvider } from "@/hooks/useStreamActions";
import LoaderUI from "@/components/LoaderUI";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: session.user.id,
        name: session.user.name || session.user.email || session.user.id,
        image: session.user.image || undefined,
      },
      tokenProvider: streamTokenProvider,
    });

    setStreamVideoClient(client);
  }, [session, status]);

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
