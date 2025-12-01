import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
   userId?: string | null;
   email?: string | null;
   message: string;
   isReplied: boolean;
   createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
   {
      userId: { type: String, default: null, index: true },
      email: { type: String, default: null },
      message: { type: String, required: true },
      isReplied: { type: Boolean, default: false },
   },
   { timestamps: { createdAt: true, updatedAt: false } }
);

feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);
