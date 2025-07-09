import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Interview from '@/models/interview';

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const update: any = { status };
  if (status === 'completed') {
    update.endTime = Date.now();
  }

  const updatedInterview = await Interview.findByIdAndUpdate(id, update, { new: true });

  return NextResponse.json(updatedInterview);
}
