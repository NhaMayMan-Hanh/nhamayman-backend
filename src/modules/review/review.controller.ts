import { Request, Response } from "express";
import reviewService from "./review.service";

class ReviewController {
  // [PUBLIC] Lấy reviews của sản phẩm
  async getReviews(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const page = Number(req.query.page) || 1;

      const result = await reviewService.getByProduct(productId, page);

      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [PUBLIC] Lấy thống kê rating của sản phẩm
  async getProductRating(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const stats = await reviewService.getAverageRating(productId);

      return res.json({ success: true, data: stats });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [AUTH] Kiểm tra user có thể review không
  async checkCanReview(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;

      const result = await reviewService.canUserReview(userId, productId);

      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [AUTH] Tạo review mới
  async createReview(req: Request, res: Response) {
    try {
      const { productId, rating, content } = req.body;
      const userId = req.user!.id;
      const username = req.user!.name || "Khách hàng";

      // Check quyền review
      const canReview = await reviewService.canUserReview(userId, productId);
      if (!canReview.canReview) {
        return res.status(403).json({
          success: false,
          message: canReview.reason,
        });
      }

      const newReview = await reviewService.create({
        productId,
        userId,
        username,
        rating,
        content,
      });

      return res.status(201).json({
        success: true,
        message: "Đánh giá thành công",
        data: newReview,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [AUTH] Lấy review của user cho sản phẩm cụ thể
  async getUserReview(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;

      const review = await reviewService.getUserReviewForProduct(userId, productId);

      return res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [AUTH] Update review của user
  async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { rating, content } = req.body;

      const updatedReview = await reviewService.update(id, userId, {
        rating,
        content,
      });

      return res.json({
        success: true,
        message: "Cập nhật đánh giá thành công",
        data: updatedReview,
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [AUTH] Xóa review của user
  async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await reviewService.delete(id, userId);

      return res.json({
        success: true,
        message: "Đã xóa đánh giá",
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // [ADMIN] Xóa bất kỳ review nào
  async deleteReviewAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await reviewService.delete(id);

      return res.json({
        success: true,
        message: "Đã xóa đánh giá",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

export default new ReviewController();
