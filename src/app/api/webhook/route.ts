import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

// Clerk sends JSON as text, so we read the raw body
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const payload = await req.text();
  const headers = req.headers;

  const svix_id = headers.get("svix-id")!;
  const svix_timestamp = headers.get("svix-timestamp")!;
  const svix_signature = headers.get("svix-signature")!;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  await dbConnect();

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses[0].email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          $set: {
            clerkId: id,
            email,
            name,
            image: image_url,
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error upserting user:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await User.findOneAndDelete({ clerkId: data.id });
    } catch (err) {
      console.error("Error deleting user:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
