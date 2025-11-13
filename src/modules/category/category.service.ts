import Category from "./category.model";
import { ICategory } from "./category.model";

export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find({}).select("-createdAt -updatedAt").sort({ createdAt: -1 });
};

export const getCategoryBySlug = async (slug: string): Promise<ICategory | null> => {
  return Category.findOne({ slug });
};
