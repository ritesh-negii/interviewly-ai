
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { startInterview } from "@/lib/interview"; 

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    

    const { 
      type = "technical", 
      difficulty = "medium", 
      duration = "standard" 
    } = body;

   
    const result = await startInterview(
      userId,
      type,
      difficulty,
      duration
    );

    return NextResponse.json(
      {
        success: true,
        message: "Interview started successfully",
        sessionId: result.sessionId, 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Start interview error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to start interview" },
      { status: 500 }
    );
  }
}