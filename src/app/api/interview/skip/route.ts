// src/app/api/interview/skip/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { skipQuestion } from "@/lib/interview";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get user ID from token
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId } = await request.json();

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Skip question
    const result = await skipQuestion(userId, sessionId);

    return NextResponse.json(
      {
        success: true,
        message: "Question skipped",
        ...result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Skip question error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to skip question" },
      { status: 500 }
    );
  }
}