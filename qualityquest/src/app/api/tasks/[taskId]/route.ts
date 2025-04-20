import { NextResponse } from "next/server";
import Task from "@/models/Task";
import connectDB from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  try {
    await connectDB();
    const task = await Task.findOne({ taskId: params.taskId }).populate('users').populate('bugs').populate('projectId');

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to get task" }, { status: 500 });
  }
}
