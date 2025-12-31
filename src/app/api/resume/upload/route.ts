import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import Resume from "@/models/Resume";
import User from "@/models/UserModel";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import PDFParser from "pdf2json"; 

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

 
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

 
    const textContent = await parsePdfBuffer(buffer);

    if (!textContent || textContent.length < 50) {
      return NextResponse.json({ message: "Could not read PDF text. File might be image-based." }, { status: 400 });
    }

 
    let parsedData = {};
    try {
      console.log("Analyzing resume with AI...");
      parsedData = await analyzeResumeWithGemini(textContent);
    } catch (err) {
      console.error("AI Analysis Failed, saving raw text only:", err);
    }

    // 4. Save to Database
    await Resume.findOneAndUpdate(
      { userId },
      {
        userId,
        fileName: file.name,
        fileContent: textContent,
        parsedData: parsedData
      },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(userId, { resumeUploaded: true });

    return NextResponse.json({ 
      success: true, 
      message: "Resume analyzed successfully",
      data: parsedData 
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1 as any);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error(errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
    
      const rawText = (pdfParser as any).getRawTextContent();
      resolve(rawText);
    });

    pdfParser.parseBuffer(buffer);
  });
}