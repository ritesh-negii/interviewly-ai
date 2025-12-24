// src/models/Resume.ts
import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  technologies?: string[];
}

export interface IExperience {
  role: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  year?: string;
}

export interface IParsedData {
  skills?: string[];
  projects?: IProject[];
  experience?: IExperience[];
  education?: IEducation[];
  targetRole?: string;
  experienceLevel?: string;
}


export interface IResume {
  _id: string;
  userId: mongoose.Types.ObjectId;
  originalText: string;
  parsedData: IParsedData;
  status: "pending" | "confirmed";
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    parsedData: {
      skills: [String],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
        },
      ],
      experience: [
        {
          role: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      targetRole: String,
      experienceLevel: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;