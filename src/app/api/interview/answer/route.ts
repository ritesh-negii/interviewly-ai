// src/app/api/interview/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { submitAnswer } from "@/lib/interview";
import type { SubmitAnswerRequest } from "@/types/interview";

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

    const body: SubmitAnswerRequest = await request.json();
    const { sessionId, questionId, answer, timeSpent } = body;

    // Validation
    if (!sessionId || !questionId || answer === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof answer !== "string" || answer.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Answer cannot be empty" },
        { status: 400 }
      );
    }

    if (typeof timeSpent !== "number" || timeSpent < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid time spent" },
        { status: 400 }
      );
    }

    // Submit answer
    const result = await submitAnswer(
      userId,
      sessionId,
      questionId,
      answer,
      timeSpent
    );

    return NextResponse.json(
      {
        success: true,
        message: "Answer submitted successfully",
        ...result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Submit answer error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit answer" },
      { status: 500 }
    );
  }
}