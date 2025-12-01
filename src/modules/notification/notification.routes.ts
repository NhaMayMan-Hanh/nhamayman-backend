import express from "express";
import notificationController from "./notification.controller";
import { authenticate } from "@/middlewares/auth.middleware";
const notificationRoutes = express.Router();

notificationRoutes.get("/", authenticate, notificationController.getAll);
// Đếm notifications chưa đọc
notificationRoutes.get("/unread-count", notificationController.countUnread);

// Đánh dấu 1 notification đã đọc
notificationRoutes.patch("/:id/read", notificationController.markAsRead);

// Đánh dấu tất cả đã đọc
notificationRoutes.patch(
   "/read-all",
   authenticate,
   notificationController.markAllAsRead
);

// Xóa notification
notificationRoutes.delete("/:id", notificationController.deleteOne);

export default notificationRoutes;
