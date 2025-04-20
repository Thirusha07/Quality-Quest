import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newBug = await Bug.create(body);

    return NextResponse.json({ success: true, bug: newBug }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create bug" }, { status: 500 });
  }
}
