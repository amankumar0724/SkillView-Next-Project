import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/user';


export async function POST(req: NextRequest) {
  await connectDb();

  const { name, email, image } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 200 });
  }

  const user = await User.create({
    name,
    email,
    image,
    role: 'candidate',
  });

  return NextResponse.json(user, { status: 201 });
}
