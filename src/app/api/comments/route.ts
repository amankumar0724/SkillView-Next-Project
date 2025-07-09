import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch comments for an interview
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const interviewId = searchParams.get("interviewId");

  if (!interviewId) {
    return NextResponse.json({ error: "Missing interviewId" }, { status: 400 });
  }

  await dbConnect();

  const comments = await Comment.find({ interviewId }).sort({ createdAt: -1 });
  return NextResponse.json(comments);
}

// POST: Add a new comment
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { interviewId, content, rating } = await req.json();

  if (!interviewId || !content || typeof rating !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();

  const comment = await Comment.create({
    interviewId,
    content,
    rating,
    interviewerId: userId,
  });

  return NextResponse.json(comment);
}
