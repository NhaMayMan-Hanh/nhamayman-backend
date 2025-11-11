import { Request, Response } from "express";
import { getAllCategories } from "./category.service";

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy categories",
      error: (error as Error).message,
    });
  }
};
