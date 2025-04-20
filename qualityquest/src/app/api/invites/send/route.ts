import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/models/Invite";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json(); // { inviteId, sentBy, sentTo }

    const newInvite = await Invite.create({
      ...body,
      status: "pending"
    });

    return NextResponse.json({ success: true, invite: newInvite }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to send invite" }, { status: 500 });
  }
}
