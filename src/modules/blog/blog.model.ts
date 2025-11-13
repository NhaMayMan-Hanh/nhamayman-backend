import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  name: string;
  img: string;
  slug: string;
  description?: string;
  content: string;
}

const blogSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
