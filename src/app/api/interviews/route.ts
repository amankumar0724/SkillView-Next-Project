import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Interview from "@/models/interview";
import User from "@/models/user"; // Required to check user role
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Get the full user record to check role
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let interviews;

  if (user.role === "candidate") {
    // 🧍 Only get candidate's own interviews
    interviews = await Interview.find({ candidateId: user._id });
  } else {
    // 👨‍💼 For interviewers/admins, return all
    interviews = await Interview.find({});
  }

  return NextResponse.json(interviews);
}
