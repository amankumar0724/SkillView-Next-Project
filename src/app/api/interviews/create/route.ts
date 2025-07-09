import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Interview from '@/models/interview';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  const {
    title, description, startTime, status,
    streamCallId, candidateId, interviewerIds
  } = body;

  const interview = await Interview.create({
    title,
    description,
    startTime,
    status,
    streamCallId,
    candidateId,
    interviewerIds,
  });

  return NextResponse.json(interview, { status: 201 });
}
