import mongoose, { Schema, Document } from "mongoose";

// Interface cho Section
export interface ISection {
  title: string;
  image: string;
  imagePosition: "left" | "right";
  content: string;
}

// Interface chính cho About
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

// Schema chính cho About
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
    sections: [sectionSchema], // Array of sections
    closingSection: {
      type: String,
    },
    content: {
      type: String,
    }, // Giữ lại để tương thích với data cũ
  },
  { timestamps: true }
);

// Index cho tìm kiếm nhanh
aboutSchema.index({ slug: 1 });
aboutSchema.index({ name: 1 });

export default mongoose.model<IAbout>("About", aboutSchema);
