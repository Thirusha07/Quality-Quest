import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { bugId, testerIds } = await req.json();

    const bug = await Bug.findOneAndUpdate(
      { bugId },
      { $addToSet: { assignedPersonTest: { $each: testerIds } } },
      { new: true }
    );

    if (!bug) return NextResponse.json({ success: false, error: "Bug not found" }, { status: 404 });

    return NextResponse.json({ success: true, bug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to assign tester(s)" }, { status: 500 });
  }
}
