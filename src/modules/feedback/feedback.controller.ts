import { Request, Response } from "express";
import feedbackService from "./feedback.service";

export default {
   // User gửi feedback
   async create(req: Request, res: Response) {
      try {
         const { email, message, userId } = req.body;

         if (!message) {
            return res.status(400).json({ error: "Message is required" });
         }

         const feedback = await feedbackService.createFeedback({
            userId: userId || null,
            email: email || null,
            message,
         });

         res.status(201).json({ success: true, data: feedback });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // Admin lấy tất cả feedback
   async getAll(req: Request, res: Response) {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 20;

         const result = await feedbackService.getAllFeedback(page, limit);

         res.json({ success: true, ...result });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // User lấy feedback của chính mình
   async getMyFeedback(req: Request, res: Response) {
      try {
         const userId = (req as any).user?.id;

         if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
         }

         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;

         const result = await feedbackService.getFeedbackByUserId(
            userId,
            page,
            limit
         );

         res.json({ success: true, ...result });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // Lấy chi tiết feedback kèm replies
   async getDetail(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const result = await feedbackService.getFeedbackWithReplies(id);

         res.json({ success: true, data: result });
      } catch (error: any) {
         res.status(404).json({ error: error.message || "Not found" });
      }
   },

   // Admin trả lời feedback
   async reply(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { adminResponse } = req.body;

         if (!adminResponse) {
            return res.status(400).json({ error: "Admin response required" });
         }
         const result = await feedbackService.replyFeedback(id, adminResponse);
         res.json({
            success: true,
            message: "Đã gửi phản hồi thành công",
            data: result,
         });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },

   // Admin xóa feedback
   async delete(req: Request, res: Response) {
      try {
         const { id } = req.params;
         await feedbackService.deleteFeedback(id);

         res.json({ success: true, message: "Đã xóa feedback" });
      } catch (error: any) {
         res.status(500).json({ error: error.message || "Server error" });
      }
   },
};
