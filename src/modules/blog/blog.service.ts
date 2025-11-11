import Blog from "./blog.model";
import { IBlog } from "./blog.model";

export const getAllBlogs = async (): Promise<IBlog[]> => {
  return Blog.find({}).sort({ createdAt: -1 });
};

export const getBlogBySlug = async (slug: string): Promise<IBlog | null> => {
  return Blog.findOne({ slug });
};
