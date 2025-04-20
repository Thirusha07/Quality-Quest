import { NextResponse } from "next/server";
import Task from "@/models/Task";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newTask = await Task.create(body);

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}
