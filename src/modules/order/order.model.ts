import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: string; // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  paymentMethod: string; // 'cash', 'card', etc.
}

const orderItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: "Việt Nam" },
    },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
