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

export interface IRelatedProduct extends IProduct {}

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

// ===== INDEXES =====

// Index cho tìm kiếm theo tên
productSchema.index({ name: "text" });

// Index cho filter theo category
productSchema.index({ category: 1 });

// Index cho stock queries (ví dụ: tìm sản phẩm hết hàng)
productSchema.index({ stock: 1 });

// Compound index cho query phổ biến: category + stock
productSchema.index({ category: 1, stock: -1 });

// ===== VIRTUAL FIELDS =====

// Virtual field để check out of stock
productSchema.virtual("isOutOfStock").get(function (this: IProduct) {
  return this.stock <= 0;
});

// Virtual field để check low stock (dưới 10)
productSchema.virtual("isLowStock").get(function (this: IProduct) {
  return this.stock > 0 && this.stock < 10;
});

export default mongoose.model<IProduct>("Product", productSchema);
