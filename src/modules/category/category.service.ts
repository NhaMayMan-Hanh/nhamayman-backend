import Category from "./category.model";
import { ICategory } from "./category.model";
import fs from "fs";

export const getAllCategories = async (query: { search?: string } = {}): Promise<ICategory[]> => {
  let filter: any = {};
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  return Category.find(filter).select("-createdAt -updatedAt").sort({ createdAt: -1 });
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

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  // Optional: Xóa ảnh cũ nếu có
  const category = await getCategoryById(id);

  if (category?.img && category.img.startsWith("/uploads/categories/")) {
    const oldPath = `.${category.img}`;
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  return Category.findByIdAndDelete(id);
};
