import Feedback from "./feedback.model";
import notificationService from "../notification/notification.service";
export default {
   // Tạo feedback
   async createFeedback(data: {
      userId?: string | null;
      email?: string | null;
      message: string;
   }) {
      return await Feedback.create(data);
   },

   // Admin lấy tất cả feedback (có pagination)
   async getAllFeedback(page = 1, limit = 20) {
      const skip = (page - 1) * limit;

      const feedbacks = await Feedback.find()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      const total = await Feedback.countDocuments();
      return {
         data: feedbacks,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      };
   },

   // Lấy feedback theo ID
   async getFeedbackById(id: string) {
      return await Feedback.findById(id);
   },

   // User lấy feedback của chính mình
   async getFeedbackByUserId(userId: string, page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const feedbacks = await Feedback.find({ userId })
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      const total = await Feedback.countDocuments({ userId });

      return {
         data: feedbacks,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      };
   },

   // Admin trả lời feedback → TẠO NOTIFICATION
   async replyFeedback(feedbackId: string, adminResponse: string) {
      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
         throw new Error("Feedback not found");
      }
      feedback.isReplied = true;
      await feedback.save();
      const notification = await notificationService.create({
         userId: feedback.userId,
         email: feedback.email,
         type: "FEEDBACK_REPLY",
         title: "Admin đã phản hồi ý kiến của bạn",
         message:
            adminResponse.length > 100
               ? `${adminResponse.substring(0, 100)}...`
               : adminResponse,
         relatedId: feedbackId,
         relatedModel: "Feedback",
         link: `/feedback/${feedbackId}`,
         metadata: {
            adminResponse,
            feedbackMessage: feedback.message,
         },
      });

      return {
         feedback,
         notification,
      };
   },

   // Lấy feedback kèm replies (từ notifications)
   async getFeedbackWithReplies(feedbackId: string) {
      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
         throw new Error("Feedback not found");
      }

      // Lấy tất cả replies từ notifications
      const replies = await notificationService.getByRelatedId(
         feedbackId,
         "Feedback"
      );

      return {
         feedback,
         replies,
      };
   },

   // Admin xóa feedback (xóa cả notifications liên quan)
   async deleteFeedback(id: string) {
      await Feedback.findByIdAndDelete(id);
      await notificationService.deleteByRelatedId(id, "Feedback");

      return { success: true };
   },
};
