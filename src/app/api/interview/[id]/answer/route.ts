import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { submitAnswer } from "@/lib/interview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);

    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const { questionId, answer, timeSpent } = await request.json();

 
    const result = await submitAnswer(
      userId, 
      id, 
      questionId, 
      answer, 
      timeSpent || 0 
    );

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { message: error.message || "Server error" }, 
      { status: 500 }
    );
  }
}