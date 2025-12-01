import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
   FEEDBACK_REPLY = "FEEDBACK_REPLY",
   ORDER_CONFIRMED = "ORDER_CONFIRMED",
   ORDER_SHIPPING = "ORDER_SHIPPING",
   ORDER_DELIVERED = "ORDER_DELIVERED",
   ORDER_CANCELLED = "ORDER_CANCELLED",
   PROMOTION = "PROMOTION",
   SYSTEM = "SYSTEM",
}

export interface INotification extends Document {
   userId?: string | null;
   email?: string | null;
   type: NotificationType;
   title: string;
   message: string;
   relatedId?: string;
   relatedModel?: "Feedback" | "Order" | "Promotion";
   link?: string;
   metadata?: any;
   isRead: boolean;
   createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
   {
      userId: { type: String, default: null, index: true },
      email: { type: String, default: null, index: true },
      type: {
         type: String,
         enum: Object.values(NotificationType),
         required: true,
      },
      title: { type: String, required: true },
      message: { type: String, required: true },
      relatedId: { type: String, index: true },
      relatedModel: { type: String, enum: ["Feedback", "Order", "Promotion"] },
      link: { type: String },
      metadata: { type: Schema.Types.Mixed },
      isRead: { type: Boolean, default: false, index: true },
   },
   { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ email: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ relatedId: 1, relatedModel: 1 });

export default mongoose.model<INotification>(
   "Notification",
   notificationSchema,
);
