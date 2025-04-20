import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/models/Invite";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const invites = await Invite.find({
      sentBy: params.userId
    }).populate("sentTo");

    return NextResponse.json({ success: true, invites });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error fetching sent invites" }, { status: 500 });
  }
}
