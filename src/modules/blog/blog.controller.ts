import { Request, Response } from "express";
import { getAllBlogs, getBlogBySlug } from "./blog.service";

export const getBlogsController = async (req: Request, res: Response) => {
  try {
    const blogs = await getAllBlogs();
    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy blogs",
      error: (error as Error).message,
    });
  }
};

export const getBlogBySlugController = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }
    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bài viết",
      error: (error as Error).message,
    });
  }
};
