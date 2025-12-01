import { NotificationType } from "./notification.model";
import Notification from "./notification.model";
interface CreateNotificationParams {
   userId?: string | null;
   email?: string | null;
   type: NotificationType | string;
   title: string;
   message: string;
   relatedId?: string;
   relatedModel?: "Feedback" | "Order" | "Promotion";
   link?: string;
   metadata?: any;
}

export default {
   async create(params: CreateNotificationParams) {
      return await Notification.create(params);
   },

   async getByUser(
      userId?: string,
      email?: string,
      options: {
         page?: number;
         limit?: number;
         isRead?: boolean;
      } = {}
   ) {
      const { page = 1, limit = 20, isRead } = options;
      const skip = (page - 1) * limit;

      const query: any = {};

      if (userId) query.userId = userId;
      else if (email) query.email = email;
      const notifications = await Notification.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      const total = await Notification.countDocuments(query);

      return {
         data: notifications,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      };
   },

   // ✅ Đếm notifications chưa đọc
   async countUnread(userId?: string, email?: string) {
      const query: any = { isRead: false };
      if (userId) query.userId = userId;
      else if (email) query.email = email;
      else return 0;

      return await Notification.countDocuments(query);
   },

   // ✅ Đánh dấu 1 notification đã đọc
   async markAsRead(notificationId: string) {
      return await Notification.findByIdAndUpdate(
         notificationId,
         { isRead: true },
         { new: true }
      );
   },

   // ✅ Đánh dấu tất cả đã đọc
   async markAllAsRead(userId?: string, email?: string) {
      const query: any = {};
      if (userId) query.userId = userId;
      else if (email) query.email = email;
      else throw new Error("Cần userId hoặc email");
      return await Notification.updateMany(query, { isRead: true });
   },

   // ✅ Lấy notifications theo relatedId (dùng cho feedback/order detail)
   async getByRelatedId(relatedId: string, relatedModel: string) {
      return await Notification.find({
         relatedId,
         relatedModel,
      }).sort({ createdAt: -1 });
   },

   // ✅ Xóa notifications theo relatedId
   async deleteByRelatedId(relatedId: string, relatedModel: string) {
      return await Notification.deleteMany({
         relatedId,
         relatedModel,
      });
   },

   // ✅ Xóa 1 notification
   async deleteOne(notificationId: string) {
      return await Notification.findByIdAndDelete(notificationId);
   },

   async notifyFeedbackReply(
      feedbackId: string,
      userId: string | null,
      email: string | null,
      adminResponse: string
   ) {
      return await this.create({
         userId,
         email,
         type: NotificationType.FEEDBACK_REPLY,
         title: "Admin đã phản hồi ý kiến của bạn",
         message:
            adminResponse.length > 100
               ? `${adminResponse.substring(0, 100)}...`
               : adminResponse,
         relatedId: feedbackId,
         relatedModel: "Feedback",
         link: `/feedback/${feedbackId}`,
         metadata: { adminResponse },
      });
   },

   // Helper: Thông báo trạng thái đơn hàng
   async notifyOrderStatus(
      orderId: string,
      userId: string | null,
      email: string | null,
      status: "confirmed" | "shipping" | "delivered" | "cancelled",
      metadata?: any
   ) {
      const statusConfig = {
         confirmed: {
            type: NotificationType.ORDER_CONFIRMED,
            title: "Đơn hàng đã được xác nhận",
            message: "Đơn hàng của bạn đang được chuẩn bị",
         },
         shipping: {
            type: NotificationType.ORDER_SHIPPING,
            title: "Đơn hàng đang được giao",
            message: "Đơn hàng của bạn đang trên đường giao đến bạn",
         },
         delivered: {
            type: NotificationType.ORDER_DELIVERED,
            title: "Đơn hàng đã giao thành công",
            message:
               "Cảm ơn bạn đã mua hàng! Đánh giá sản phẩm để nhận điểm thưởng",
         },
         cancelled: {
            type: NotificationType.ORDER_CANCELLED,
            title: "Đơn hàng đã bị hủy",
            message:
               "Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ CSKH nếu cần hỗ trợ",
         },
      };

      const config = statusConfig[status];

      return await this.create({
         userId,
         email,
         type: config.type,
         title: config.title,
         message: config.message,
         relatedId: orderId,
         relatedModel: "Order",
         link: `/orders/${orderId}`,
         metadata: { orderStatus: status, ...metadata },
      });
   },
};
