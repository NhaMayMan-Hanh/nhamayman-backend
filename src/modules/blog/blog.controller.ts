import { Request, Response } from "express";
import { getAllBlogs, getBlogBySlug } from "./blog.service";

export const getBlogsController = async (req: Request, res: Response) => {
  try {
    const blogs = await getAllBlogs();
    res.json({
      success: true,
      message: "Successfully get blogs",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get blogs",
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
        message: "Failed to get blog",
      });
    }
    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get blog",
      error: (error as Error).message,
    });
  }
};
