import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import InterviewSession from "@/models/InterviewSession";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    const sessions = await InterviewSession.find({ userId })
      .select("type difficulty status overallScore createdAt totalQuestions")
      .sort({ createdAt: -1 });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}