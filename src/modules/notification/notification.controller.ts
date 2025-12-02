import { Request, Response } from "express";
import notificationService from "./notification.service";
export default {
   async getAll(req: Request, res: Response) {
      try {
         const userId = (req as any).user?.id;
         const email = (req as any).user?.email;
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 20;
         const isRead =
            req.query.isRead === "true"
               ? true
               : req.query.isRead === "false"
               ? false
               : undefined;

         const result = await notificationService.getByUser(userId, email, {
            page,
            limit,
            isRead,
         });

         res.json({ success: true, ...result });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   async countUnread(req: Request, res: Response) {
      try {
         const userId = (req as any).user?.id;
         const email = (req as any).user?.email;

         const count = await notificationService.countUnread(userId, email);

         res.json({ success: true, count });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // Đánh dấu 1 notification đã đọc
   async markAsRead(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const notification = await notificationService.markAsRead(id);

         if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
         }

         res.json({ success: true, data: notification });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   async markAllAsRead(req: Request, res: Response) {
      try {
         const userId = (req as any).user?.id;
         const email = (req as any).user?.email;
         await notificationService.markAllAsRead(userId, email);
         res.json({ success: true, message: "Đã đánh dấu tất cả đã đọc" });
      } catch (error: any) {
         console.log(error);
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // Xóa 1 notification
   async deleteOne(req: Request, res: Response) {
      try {
         const { id } = req.params;
         await notificationService.deleteOne(id);

         res.json({ success: true, message: "Đã xóa notification" });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },
};
