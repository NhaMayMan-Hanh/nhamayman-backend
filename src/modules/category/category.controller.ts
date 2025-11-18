import { Request, Response } from "express";
import {
   getAllCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
} from "./category.service";
import { buildImageUrl } from "../../utils/buildImageUrl";

import fs from "fs";
import path from "path";

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
         message: "Lấy danh mục thành công",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi lấy danh mục",
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
            .json({ success: false, message: "Không tìm thấy danh mục" });
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
         message: "Lỗi khi lấy danh mục",
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
         img: `${BASE_URL || ""}${newCategory.img}`,
      };
      res.status(201).json({
         success: true,
         message: "Tạo danh mục thành công",
         data: responseData,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi tạo danh mục",
         error: (error as Error).message,
      });
   }
};

// Admin: PUT update (với upload optional, xóa img cũ nếu có file mới)
export const updateCategoryController = async (req: Request, res: Response) => {
   try {
      const updateData: any = { ...req.body };

      // Nếu có upload ảnh mới → xóa ảnh cũ + lưu ảnh mới
      if (req.file) {
         const oldCategory = await getCategoryById(req.params.id);

         if (
            oldCategory?.img &&
            oldCategory.img.startsWith("/uploads/categories/")
         ) {
            const oldPath = path.join(process.cwd(), oldCategory.img); // đúng đường dẫn tuyệt đối
            if (fs.existsSync(oldPath)) {
               await fs.promises.unlink(oldPath); // async + await → an toàn, không lỗi
               console.log("Đã xóa ảnh cũ:", oldPath);
            }
         }
         updateData.img = `/uploads/categories/${req.file.filename}`;
      }
      // Nếu KHÔNG có req.file → giữ nguyên ảnh cũ (tự động)
      const updatedCategory = await updateCategory(req.params.id, updateData);
      if (!updatedCategory) {
         return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy danh mục" });
      }

      // Trả về dữ liệu sạch sẽ, không prepend URL (frontend tự xử lý)
      res.json({
         success: true,
         message: "Cập nhật danh mục thành công",
         data: updatedCategory.toObject(), // img vẫn là "/uploads/categories/xxx.jpg"
      });
   } catch (error) {
      console.error("Lỗi update danh mục:", error);
      res.status(500).json({
         success: false,
         message: "Lỗi server khi cập nhật",
         error: error instanceof Error ? error.message : "Unknown error",
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
            .json({ success: false, message: "Không tìm thấy danh mục" });
      }
      res.json({
         success: true,
         message: "Xóa danh mục thành công",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi xóa danh mục",
         error: (error as Error).message,
      });
   }
};
