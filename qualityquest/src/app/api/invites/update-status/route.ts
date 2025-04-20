import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/models/Invite";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { inviteId, status } = await req.json(); // status: 'accepted' | 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updatedInvite = await Invite.findOneAndUpdate(
      { inviteId },
      { status },
      { new: true }
    );

    if (!updatedInvite) {
      return NextResponse.json({ success: false, error: "Invite not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, invite: updatedInvite });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update invite status" }, { status: 500 });
  }
}
