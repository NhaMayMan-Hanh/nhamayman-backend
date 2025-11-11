import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Lưu price tại thời điểm add để tránh thay đổi
}

export interface ICart extends Document {
  userId: string; // Ref user _id (sau khi có user module)
  items: ICartItem[];
  total: number; // Tính tổng
}

const cartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const cartSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true }, // User ID string
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);
