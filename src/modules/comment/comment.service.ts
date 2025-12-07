// services/comment.service.ts
import Comment, { IComment } from "./comment.model";

class CommentService {
   async getByProduct(productId: string, page = 1, limit = 10) {
      const comments = await Comment.find({ productId })
         .populate({
            path: "userId",
            select: "name avatar", // chỉ lấy những field cần thiết
         })
         .sort({ createdAt: -1 })
         .skip((page - 1) * limit)
         .limit(limit)
         .lean(); // lean() để trả về plain object → dễ map

      // Map lại để frontend nhận đúng field đẹp
      return comments.map((c: any) => ({
         _id: c._id,
         content: c.content,
         rating: c.rating,
         username: c.userId?.name || c.username || "Khách hàng", // ưu tiên tên thật
         avatar: c.userId?.avatar || "/img/default-avatar.jpg",
         createdAt: c.createdAt,
      }));
   }

   async create(data: Partial<IComment>) {
      // Khi tạo vẫn lưu username như cũ (fallback khi user bị xóa)
      const comment = await Comment.create({
         ...data,
         username: data.username || "Khách hàng",
      });
      // Trả về kèm populate luôn (để realtime comment đẹp ngay)
      return await Comment.findById(comment._id).populate({
         path: "userId",
         select: "name avatar",
      });
   }

   async delete(id: string) {
      return await Comment.findByIdAndDelete(id);
   }

   async getAll(filters: {
      page?: number;
      limit?: number;
      search?: string;
      productId?: string;
      sortBy?: string;
   }) {
      const {
         page = 1,
         limit = 20,
         search = "",
         productId = "",
         sortBy = "createdAt",
      } = filters;

      // Build filter query
      let query: any = {};

      // Filter by product
      if (productId) {
         query.productId = productId;
      }

      // Search by content or username
      if (search) {
         query.$or = [
            { content: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
         ];
      }

      // Count total
      const total = await Comment.countDocuments(query);

      // Sort options
      const sortOptions: any = {
         createdAt: { createdAt: -1 },
         oldest: { createdAt: 1 },
         rating: { rating: -1 },
      };

      // Get comments
      const comments = await Comment.find(query)
         .populate({
            path: "userId",
            select: "name email avatar",
         })
         .populate({
            path: "productId",
            select: "name image",
         })
         .sort(sortOptions[sortBy] || { createdAt: -1 })
         .skip((page - 1) * limit)
         .limit(limit)
         .lean();

      // Map data
      const data = comments.map((c: any) => ({
         _id: c._id,
         content: c.content,
         rating: c.rating,
         username: c.userId?.name || c.username || "Khách hàng",
         userEmail: c.userId?.email || "N/A",
         avatar: c.userId?.avatar || "/img/default-avatar.jpg",
         productId: c.productId?._id || null,
         productName: c.productId?.name || "Sản phẩm đã xóa",
         productImage: c.productId?.image || "/img/no-image.png",
         createdAt: c.createdAt,
         updatedAt: c.updatedAt,
      }));

      return {
         data,
         pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }
}

export default new CommentService();
