// ✅ useStreamActions.ts (no changes needed)
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("User not authenticated");

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  const token = streamClient.generateUserToken({ user_id: session.user.id! });
  return token;
};
