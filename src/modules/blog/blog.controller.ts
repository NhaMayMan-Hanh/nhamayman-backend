import { Request, Response } from "express";
import {
   getAllBlogs,
   getBlogBySlug,
   getBlogById,
   createBlog,
   updateBlog,
   deleteBlog,
} from "./blog.service";
import { buildImageUrl } from "@/utils/buildImageUrl";
import fs from "fs";
// Public: GET list (optional ?search=keyword)
export const getBlogsController = async (req: Request, res: Response) => {
   try {
      const { search } = req.query;
      const blogs = await getAllBlogs({ search: search as string });

      // Prepend URL cho imgs
      const responseData = blogs.map((blog) => {
         const { content, ...rest } = blog.toObject();
         return {
            ...rest,
            img: buildImageUrl(rest.img),
         };
      });

      res.json({
         success: true,
         message: "Successfully get blogs",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get blogs",
         error: (error as Error).message,
      });
   }
};

// Public: GET by slug
export const getBlogBySlugController = async (req: Request, res: Response) => {
   try {
      const { slug } = req.params;
      const blog = await getBlogBySlug(slug);
      if (!blog) {
         return res.status(404).json({
            success: false,
            message: "Blog not found",
         });
      }

      const responseData = {
         ...blog.toObject(),
         img: buildImageUrl(blog.img),
      };

      res.json({
         success: true,
         message: "Successfully get blog",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get blog",
         error: (error as Error).message,
      });
   }
};

// Admin: GET all (list, reuse public logic)
export const getAllBlogsAdminController = async (
   req: Request,
   res: Response
) => {
   try {
      const { search } = req.query;
      const blogs = await getAllBlogs({ search: search as string });

      const responseData = blogs.map((blog) => ({
         ...blog.toObject(),
         img: buildImageUrl(blog.img),
      }));

      res.json({
         success: true,
         message: "Successfully get blogs",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get blogs",
         error: (error as Error).message,
      });
   }
};

// Admin: GET by ID
export const getBlogByIdController = async (req: Request, res: Response) => {
   try {
      const blog = await getBlogById(req.params.id);
      if (!blog) {
         return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy blog" });
      }

      const responseData = {
         ...blog.toObject(),
         img: buildImageUrl(blog.img),
      };

      res.json({
         success: true,
         message: "Successfully get blog",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get blog",
         error: (error as Error).message,
      });
   }
};

// Admin: POST create (với upload)
export const createBlogController = async (req: Request, res: Response) => {
   try {
      if (req.file) {
         req.body.img = `/uploads/blogs/${req.file.filename}`;
      }

      const newBlog = await createBlog(req.body);

      const responseData = {
         ...newBlog.toObject(),
         img: buildImageUrl(newBlog.img),
      };

      res.status(201).json({
         success: true,
         message: "Successfully create blog",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error create blog",
         error: (error as Error).message,
      });
   }
};

// Admin: PUT update (với upload optional, xóa img cũ)
export const updateBlogController = async (req: Request, res: Response) => {
   try {
      let updateData = req.body;
      if (req.file) {
         // Xóa img cũ
         const oldBlog = await getBlogById(req.params.id);
         if (oldBlog?.img && oldBlog.img.startsWith("/uploads/blogs/")) {
            const oldPath = `.${oldBlog.img}`;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
         }
         updateData.img = `/uploads/blogs/${req.file.filename}`;
      }

      const updatedBlog = await updateBlog(req.params.id, updateData);
      if (!updatedBlog) {
         return res
            .status(404)
            .json({ success: false, message: "Blog not found" });
      }

      const responseData = {
         ...updatedBlog.toObject(),
         img: buildImageUrl(updatedBlog.img),
      };

      res.json({
         success: true,
         message: "Successfully update blog",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error update blog",
         error: (error as Error).message,
      });
   }
};

// Admin: DELETE
export const deleteBlogController = async (req: Request, res: Response) => {
   try {
      const deletedBlog = await deleteBlog(req.params.id);
      if (!deletedBlog) {
         return res
            .status(404)
            .json({ success: false, message: "Blog not found" });
      }
      res.json({
         success: true,
         message: "Successfully delete blog",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error delete blog",
         error: (error as Error).message,
      });
   }
};
