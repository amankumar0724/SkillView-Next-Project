import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Interview from '@/models/interview';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 200 });

  await dbConnect();
  const interviews = await Interview.find({ candidateId: session.user.email });

  return NextResponse.json(interviews);
}
