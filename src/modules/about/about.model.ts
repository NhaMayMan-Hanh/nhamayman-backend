import mongoose, { Schema, Document } from "mongoose";

export interface ISection {
  title: string;
  image: string;
  imagePosition: "left" | "right";
  content: string;
}

export interface IAbout extends Document {
  name: string;
  img: string;
  slug: string;
  description: string;
  heroTitle?: string;
  heroSubtitle?: string;
  introSection?: string;
  sections?: ISection[];
  closingSection?: string;
  content?: string; // Giữ lại để backward compatible với data cũ
}

// Schema cho Section
const sectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    imagePosition: {
      type: String,
      enum: ["left", "right"],
      required: true,
    },
    content: { type: String, required: true },
  },
  { _id: false } // Không tạo _id cho sub-document
);

const aboutSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    heroTitle: {
      type: String,
    },
    heroSubtitle: {
      type: String,
    },
    introSection: {
      type: String,
    },
    sections: [sectionSchema],
    closingSection: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAbout>("About", aboutSchema);
