import Review, { IReview } from "./review.model";
import Order from "../order/order.model";
import mongoose from "mongoose";

class ReviewService {
   // Lấy reviews theo sản phẩm
   async getByProduct(productId: string, page = 1, limit = 10) {
      const reviews = await Review.find({ productId })
         .sort({ createdAt: -1 })
         .skip((page - 1) * limit)
         .limit(limit)
         .populate("userId", "name email");

      const total = await Review.countDocuments({ productId });

      return {
         reviews,
         total,
         page,
         totalPages: Math.ceil(total / limit),
      };
   }

   // Tính average rating cho sản phẩm
   async getAverageRating(productId: string) {
      const result = await Review.aggregate([
         { $match: { productId: new mongoose.Types.ObjectId(productId) } },
         {
            $group: {
               _id: null,
               avgRating: { $avg: "$rating" },
               totalReviews: { $sum: 1 },
            },
         },
      ]);

      if (result.length === 0) {
         return { avgRating: 0, totalReviews: 0 };
      }

      return {
         avgRating: Math.round(result[0].avgRating * 10) / 10, // Round to 1 decimal
         totalReviews: result[0].totalReviews,
      };
   }

   // Kiểm tra user đã mua sản phẩm chưa
   async checkUserPurchased(userId: string, productId: string) {
      const order = await Order.findOne({
         userId,
         "items.productId": productId,
         status: { $in: ["delivered", "confirmed", "shipped"] }, // Chỉ tính đơn đã xác nhận trở lên
      });

      return !!order;
   }

   // Kiểm tra user đã review sản phẩm chưa
   async checkUserReviewed(userId: string, productId: string) {
      const review = await Review.findOne({ userId, productId });
      return !!review;
   }

   // Kiểm tra quyền review (đã mua + chưa review)
   async canUserReview(userId: string, productId: string) {
      const hasPurchased = await this.checkUserPurchased(userId, productId);
      if (!hasPurchased) {
         return {
            canReview: false,
            reason: "Bạn cần mua sản phẩm trước khi đánh giá",
         };
      }

      const hasReviewed = await this.checkUserReviewed(userId, productId);
      if (hasReviewed) {
         return {
            canReview: false,
            reason: "Bạn đã đánh giá sản phẩm này rồi",
         };
      }

      return { canReview: true };
   }

   // Tạo review mới
   async create(data: {
      productId: string;
      userId: string;
      username: string;
      rating: number;
      content: string;
   }) {
      // Tìm order của user có chứa sản phẩm này
      const order = await Order.findOne({
         userId: data.userId,
         "items.productId": data.productId,
         status: { $in: ["delivered", "confirmed", "shipped"] },
      }).sort({ createdAt: -1 }); // Lấy order mới nhất

      if (!order) {
         throw new Error("Không tìm thấy đơn hàng phù hợp");
      }

      const review = await Review.create({
         ...data,
         orderId: order._id,
      });

      return review.populate("userId", "name email");
   }

   // Xóa review (admin hoặc chính user đó)
   async delete(reviewId: string, userId?: string) {
      const review = await Review.findById(reviewId);

      if (!review) {
         throw new Error("Không tìm thấy đánh giá");
      }

      // Nếu có userId, check quyền
      if (userId && review.userId.toString() !== userId) {
         throw new Error("Bạn không có quyền xóa đánh giá này");
      }

      return await Review.findByIdAndDelete(reviewId);
   }

   // Update review (chỉ user tự update của mình)
   async update(
      reviewId: string,
      userId: string,
      data: { rating?: number; content?: string }
   ) {
      const review = await Review.findById(reviewId);

      if (!review) {
         throw new Error("Không tìm thấy đánh giá");
      }

      if (review.userId.toString() !== userId) {
         throw new Error("Bạn không có quyền sửa đánh giá này");
      }

      return await Review.findByIdAndUpdate(reviewId, data, {
         new: true,
      }).populate("userId", "name email");
   }

   // Lấy review của user cho sản phẩm cụ thể
   async getUserReviewForProduct(userId: string, productId: string) {
      return await Review.findOne({ userId, productId }).populate(
         "userId",
         "name email"
      );
   }

   async getAllReviewAdmin(query: any) {
      return await Review.find(query);
   }
}

export default new ReviewService();
