import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  img: string;
  slug: string;
  description?: string;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
