import { Request, Response } from "express";
import commentService from "./comment.service";

class CommentController {
   async getComments(req: Request, res: Response) {
      try {
         const { productId } = req.params;
         const page = Number(req.query.page) || 1;

         const result = await commentService.getByProduct(productId, page);

         return res.json({ success: true, data: result });
      } catch (error) {
         return res.status(500).json({ success: false, message: error });
      }
   }

   // Admin: Lấy tất cả comments
   async getAllComments(req: Request, res: Response) {
      try {
         const { page, limit, search, productId, sortBy } = req.query;

         const result = await commentService.getAll({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search as string,
            productId: productId as string,
            sortBy: sortBy as string,
         });

         return res.json({
            success: true,
            message: "Lấy danh sách bình luận thành công",
            data: result.data,
            pagination: result.pagination,
         });
      } catch (error) {
         return res.status(500).json({
            success: false,
            message: (error as Error).message,
         });
      }
   }

   async createComment(req: Request, res: Response) {
      try {
         const { productId, content, rating } = req.body;
         const userId = req.user?.id;
         const nameUser = req.user?.name;
         const newComment = await commentService.create({
            productId,
            content,
            rating,
            userId: userId,
            username: nameUser || "Khách hàng",
         } as any);

         return res.json({ success: true, data: newComment });
      } catch (error) {
         return res.status(500).json({ success: false, message: error });
      }
   }

   async deleteComment(req: Request, res: Response) {
      try {
         const { id } = req.params;

         await commentService.delete(id);

         return res.json({ success: true, message: "Đã xóa bình luận" });
      } catch (error) {
         return res.status(500).json({ success: false, message: error });
      }
   }
}

export default new CommentController();
