import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/models/Invite";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const invites = await Invite.find({
      sentTo: params.userId
    }).populate("sentBy");

    return NextResponse.json({ success: true, invites });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error fetching received invites" }, { status: 500 });
  }
}
