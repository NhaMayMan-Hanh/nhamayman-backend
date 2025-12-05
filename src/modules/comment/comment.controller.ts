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
