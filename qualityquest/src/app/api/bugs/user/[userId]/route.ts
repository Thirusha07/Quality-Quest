import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const { userId } = params;

    const bugs = await Bug.find({
      $or: [
        { assignedPersonDev: userId },
        { assignedPersonTest: userId },
      ]
    }).populate('taskId').populate('assignedPersonDev').populate('assignedPersonTest');

    return NextResponse.json({ success: true, bugs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch bugs" }, { status: 500 });
  }
}
