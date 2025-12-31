import mongoose, { Schema, Model } from "mongoose";


export interface IParsedData {
  skills: string[];
  projects: any[];
  experience: any[];
  education: any[];
}


export interface IResume {
  userId: mongoose.Types.ObjectId;
  fileUrl?: string;
  fileName: string;
  fileContent: string;
  parsedData: IParsedData; 
  createdAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fileName: { type: String, required: true },
    fileContent: { type: String, required: true },
    parsedData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema);
export default Resume;