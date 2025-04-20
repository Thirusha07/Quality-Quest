import { NextResponse } from "next/server";
import Task from "@/models/Task";
import connectDB from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const tasks = await Task.find({ users: params.userId }).populate('users').populate('projectId');

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to get tasks for user" }, { status: 500 });
  }
}
