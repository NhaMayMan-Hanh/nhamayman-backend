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
}

export default new CommentService();
