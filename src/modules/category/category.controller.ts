import { Request, Response } from "express";
import {
   getAllCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
} from "./category.service";
import { buildImageUrl } from "@/utils/buildImageUrl";
import fs from "fs";
// Public: GET all (dùng cho cả public/admin list, nhưng admin có thể filter) ?search=phone
export const getCategoriesController = async (req: Request, res: Response) => {
   try {
      const { search } = req.query;
      const categories = await getAllCategories({ search: search as string });

      // Prepend ASSET_BASE_URL cho img (full URL cho client)
      const responseData = categories.map((cat) => ({
         ...cat.toObject(),
         img: buildImageUrl(cat.img),
      }));

      res.json({
         success: true,
         message: "Successfully get categories",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get categories",
         error: (error as Error).message,
      });
   }
};

// Admin: GET by ID
export const getCategoryByIdController = async (
   req: Request,
   res: Response
) => {
   try {
      const category = await getCategoryById(req.params.id);
      if (!category) {
         return res
            .status(404)
            .json({ success: false, message: "Categories not found" });
      }

      // Prepend URL
      const responseData = {
         ...category.toObject(),
         img: `${process.env.ASSET_BASE_URL || ""}${category.img}`,
      };

      res.json({
         success: true,
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error get category",
         error: (error as Error).message,
      });
   }
};

// Admin: POST create (với upload)
export const createCategoryController = async (req: Request, res: Response) => {
   try {
      if (req.file) {
         req.body.img = `/uploads/categories/${req.file.filename}`;
      }

      const newCategory = await createCategory(req.body);
      const BASE_URL = `${req.protocol}://${req.get("host")}`;

      // Prepend URL cho response
      const responseData = {
         ...newCategory.toObject(),
         img: `${process.env.ASSET_BASE_URL || ""}${newCategory.img}`,
      };

      res.status(201).json({
         success: true,
         message: "Successfully create category",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error create category",
         error: (error as Error).message,
      });
   }
};

// Admin: PUT update (với upload optional, xóa img cũ nếu có file mới)
export const updateCategoryController = async (req: Request, res: Response) => {
   try {
      let updateData = req.body;
      if (req.file) {
         // Xóa img cũ
         const oldCategory = await getCategoryById(req.params.id);
         if (
            oldCategory?.img &&
            oldCategory.img.startsWith("/uploads/categories/")
         ) {
            const oldPath = `.${oldCategory.img}`;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
         }
         updateData.img = `/uploads/categories/${req.file.filename}`;
      }

      const updatedCategory = await updateCategory(req.params.id, updateData);
      if (!updatedCategory) {
         return res
            .status(404)
            .json({ success: false, message: "Categories not found" });
      }

      // Prepend URL
      const responseData = {
         ...updatedCategory.toObject(),
         img: `${process.env.ASSET_BASE_URL || ""}${updatedCategory.img}`,
      };

      res.json({
         success: true,
         message: "Successfully update category",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error update category",
         error: (error as Error).message,
      });
   }
};

// Admin: DELETE
export const deleteCategoryController = async (req: Request, res: Response) => {
   try {
      const deletedCategory = await deleteCategory(req.params.id);
      if (!deletedCategory) {
         return res
            .status(404)
            .json({ success: false, message: "Categories not found" });
      }
      res.json({
         success: true,
         message: "Successfully delete category",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error delete category",
         error: (error as Error).message,
      });
   }
};
