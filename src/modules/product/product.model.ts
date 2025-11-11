// src/modules/product/product.model.ts (Cập nhật nhỏ: bỏ createdAt khỏi interface vì timestamps tự add)
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  detailedDescription?: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    detailedDescription: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
