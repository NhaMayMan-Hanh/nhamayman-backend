import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  img: string;
  slug: string;
  description?: string;
  status: boolean;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    status: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
