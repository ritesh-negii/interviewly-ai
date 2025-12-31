import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import InterviewSession from "@/models/InterviewSession";

export async function GET(
  request: NextRequest,
  
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

   
    const { id } = await params;

    const session = await InterviewSession.findOne({ _id: id, userId });

    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Result API Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}