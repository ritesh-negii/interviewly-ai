import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { getNextQuestion } from "@/lib/interview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);


    const { id } = await params;

    console.log("🔍 API Debug - Fetching Question");
    console.log("   User ID:", userId);
    console.log("   Session ID:", id); 

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await getNextQuestion(userId, id);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("❌ Error fetching question:", error.message);
    
    if (error.message === "Interview already complete") {
        return NextResponse.json({ completed: true });
    }

    return NextResponse.json(
      { message: error.message || "Server error" }, 
      { status: 500 }
    );
  }
}