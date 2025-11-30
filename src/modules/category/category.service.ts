import Category from "./category.model";
import { ICategory } from "./category.model";
import Product from "../product/product.model";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

export const getActiveCategories = async (
  query: { search?: string } = {}
): Promise<ICategory[]> => {
  const filter: any = { status: true };

  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  return Category.find(filter).select("-createdAt -updatedAt").sort({ createdAt: -1 });
};

export const adminGetAllCategories = async (
  query: { search?: string } = {}
): Promise<ICategory[]> => {
  const filter: any = {};

  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  return Category.find(filter).sort({ createdAt: -1 });
};

export const getCategoryBySlug = async (slug: string): Promise<ICategory | null> => {
  return Category.findOne({ slug });
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  return Category.findById(id);
};

export const createCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  const newCategory = new Category(categoryData);
  return newCategory.save();
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<ICategory>
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, categoryData, { new: true });
};

export const deleteCategory = async (
  id: string
): Promise<{ success: boolean; message: string; data?: ICategory }> => {
  const category = await Category.findById(id);
  if (!category) {
    return { success: false, message: "Danh mục không tồn tại" };
  }

  const productCount = await Product.countDocuments({
    category: category.name,
  });

  if (productCount > 0) {
    return {
      success: false,
      message: `Không thể xóa danh mục vì còn ${productCount} sản phẩm thuộc danh mục này.`,
    };
  }

  // Xóa ảnh nếu có
  if (category.img && category.img.startsWith("/uploads/categories/")) {
    const oldPath = path.join(process.cwd(), category.img); // Dùng path.join cho an toàn
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Xóa danh mục
  await Category.findByIdAndDelete(id);

  return {
    success: true,
    message: "Xóa danh mục thành công",
    data: category,
  };
};
