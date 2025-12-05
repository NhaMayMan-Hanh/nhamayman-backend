import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema = new Schema(
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
    },
    username: {
      type: String,
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

export default mongoose.model<IComment>("Comment", commentSchema);
