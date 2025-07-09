import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
  }

  await connectDb();

  const users = await User.find();
  return NextResponse.json(users);
}
