import Blog from "./blog.model";
import { IBlog } from "./blog.model";

export const getAllBlogs = async (query: { search?: string } = {}): Promise<IBlog[]> => {
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

export const updateBlog = async (id: string, blogData: Partial<IBlog>): Promise<IBlog | null> => {
  return Blog.findByIdAndUpdate(id, blogData, { new: true });
};

export const deleteBlog = async (id: string): Promise<IBlog | null> => {
  // Xóa img cũ nếu có
  const blog = await getBlogById(id);
  if (blog?.img && blog.img.startsWith("/uploads/blogs/")) {
    const fs = require("fs");
    const oldPath = `.${blog.img}`;
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  return Blog.findByIdAndDelete(id);
};
