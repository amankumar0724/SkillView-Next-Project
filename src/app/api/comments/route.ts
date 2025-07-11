import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this points to your NextAuth config
import dbConnect from "@/lib/db";
import Comment from "@/models/comment";

// GET: Fetch comments for an interview
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const interviewId = searchParams.get("interviewId");

  if (!interviewId) {
    return NextResponse.json({ error: "Missing interviewId" }, { status: 400 });
  }

  await dbConnect();

  try {
    const comments = await Comment.find({ interviewId }).sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (err) {
    console.log("Error in fetching comments: ",err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Add a new comment
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { interviewId, content, rating } = await req.json();

  if (!interviewId || !content || typeof rating !== "number") {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  await dbConnect();

  try {
    const comment = await Comment.create({
      interviewId,
      content,
      rating,
      interviewerId: session.user.id, // Use session.user.id as the interviewer's ID
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("Failed to post comment:",error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
