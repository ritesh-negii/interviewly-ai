// src/app/api/interview/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { startInterview } from "@/lib/interview";
import type { StartInterviewRequest } from "@/types/interview";

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

    const body: StartInterviewRequest = await request.json();
    const { type, difficulty, duration } = body;

    // Validation
    if (!type || !difficulty || !duration) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["technical", "behavioral", "role-specific"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid interview type" },
        { status: 400 }
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { success: false, message: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    if (!["quick", "standard", "full"].includes(duration)) {
      return NextResponse.json(
        { success: false, message: "Invalid duration" },
        { status: 400 }
      );
    }

    // Start interview
    const result = await startInterview(userId, type, difficulty, duration);

    return NextResponse.json(
      {
        success: true,
        message: "Interview started successfully",
        ...result,
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