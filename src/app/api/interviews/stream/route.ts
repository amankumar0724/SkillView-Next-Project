import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Interview from '@/models/interview';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const streamCallId = searchParams.get('streamCallId');

  if (!streamCallId) {
    return NextResponse.json({ error: 'streamCallId is required' }, { status: 400 });
  }

  const interview = await Interview.findOne({ streamCallId });
  return NextResponse.json(interview);
}
