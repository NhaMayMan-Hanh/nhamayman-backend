import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId; // Để tracking đơn hàng nào được review
  username: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Index để check user đã review sản phẩm chưa
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);
