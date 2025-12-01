import mongoose from "mongoose";
import Blog from "./blog.model";
import { IBlog } from "./blog.model";
import fs from "fs";

export const getAllBlogs = async (
   query: { search?: string } = {}
): Promise<IBlog[]> => {
   let filter: any = {};
   if (query.search) {
      filter.$or = [
         { name: { $regex: query.search, $options: "i" } },
         { description: { $regex: query.search, $options: "i" } },
      ];
   }
   return Blog.find(filter).sort({ createdAt: -1 });
};

export const getBlogBySlug = async (slug: string): Promise<IBlog | null> => {
   return Blog.findOne({ slug });
};

export const getBlogById = async (id: string): Promise<IBlog | null> => {
   return Blog.findById(id);
};

export const createBlog = async (blogData: Partial<IBlog>): Promise<IBlog> => {
   const newBlog = new Blog(blogData);
   return newBlog.save();
};

export const updateBlog = async (
   id: string,
   blogData: Partial<IBlog>
): Promise<IBlog | null> => {
   return Blog.findByIdAndUpdate(id, blogData, { new: true });
};

export const deleteBlog = async (id: string): Promise<IBlog | null> => {
   // Xóa img cũ nếu có
   const blog = await getBlogById(id);
   if (blog?.img && blog.img.startsWith("/uploads/blogs/")) {
      const oldPath = `.${blog.img}`;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
   }
   return Blog.findByIdAndDelete(id);
};

export const toggleLikeBlog = async (
   blogId: string,
   userId: string
): Promise<{ blog: IBlog; hasLiked: boolean } | null> => {
   try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const blog = await Blog.findById(blogId);
      if (!blog) return null;

      const hasLiked = blog.likedBy.some((id) => id.equals(userObjectId));

      if (hasLiked) {
         // Xóa user khỏi danh sách like
         blog.likedBy = blog.likedBy.filter((id) => !id.equals(userObjectId));
      } else {
         // Thêm user vào danh sách like (dùng ObjectId)
         blog.likedBy.push(userObjectId);
      }

      blog.like = blog.likedBy.length;
      await blog.save();

      // Trả về blog mới nhất + trạng thái mới
      return {
         blog: blog.toObject() as IBlog, // toObject() để tránh proxy
         hasLiked: !hasLiked,
      };
   } catch (error) {
      console.error("Error toggling like:", error);
      throw new Error("Unable to toggle like for the blog.");
   }
};

export const addCommentToBlog = async (
   blogId: string,
   user: { _id: string; name: string; avatar?: string },
   content: string,
   parentPath?: string[] // [], [cm1], [cm1, cm2]
): Promise<IBlog> => {
   // Validate input
   if (!content || content.trim().length === 0) {
      throw new Error("Nội dung bình luận không được trống");
   }

   if (!parentPath) parentPath = [];

   // Validate parentPath length
   if (parentPath.length > 2) {
      throw new Error("Chỉ được trả lời tối đa 3 cấp");
   }

   const blog = await Blog.findById(blogId);
   if (!blog) throw new Error("Blog not found");

   const newComment = {
      _id: new (require("mongoose").Types.ObjectId)(), // Tạo ID mới
      user: new (require("mongoose").Types.ObjectId)(user._id),
      userName: user.name,
      userAvatar: user.avatar || "",
      content: content.trim(),
      likes: 0,
      likedBy: [],
      isDeleted: false,
      createdAt: new Date(),
   };

   if (parentPath.length === 0) {
      // Comment gốc
      blog.comments.push({
         ...newComment,
         replies: [],
      } as any);
   } else if (parentPath.length === 1) {
      // Reply cấp 1
      const parentComment = blog.comments.find(
         (c) => c._id.toString() === parentPath[0]
      );
      if (!parentComment) throw new Error("Comment cha không tồn tại");

      parentComment.replies.push({
         ...newComment,
         replies: [],
      } as any);
   } else if (parentPath.length === 2) {
      // Reply cấp 2
      const parentComment = blog.comments.find(
         (c) => c._id.toString() === parentPath[0]
      );
      if (!parentComment) throw new Error("Comment cha không tồn tại");

      const parentReply = parentComment.replies.find(
         (r) => r._id.toString() === parentPath[1]
      );
      if (!parentReply) throw new Error("Reply cha không tồn tại");

      parentReply.replies.push(newComment as any);
   }

   await blog.save();
   return blog;
};
