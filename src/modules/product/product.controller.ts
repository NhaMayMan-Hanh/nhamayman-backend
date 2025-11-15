import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.service";
import { getCategoryBySlug } from "../category/category.service";

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const { category: slug, search } = req.query;
    let categoryName: string | undefined;

    // Nếu có slug, map sang category name
    if (slug) {
      const category = await getCategoryBySlug(slug as string);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục",
        });
      }
      categoryName = category.name;
    }

    const products = await getAllProducts({
      category: categoryName,
      search: search as string,
    });
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy products",
      error: (error as Error).message,
    });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Lấy related products (cùng category, exclude current)
    const related = await getRelatedProducts(product.category, product._id as string);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts: related,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm",
      error: (error as Error).message,
    });
  }
};
export const createProductController = async (req: Request, res: Response) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo product",
      error: (error as Error).message,
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy product",
      });
    }
    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật product",
      error: (error as Error).message,
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy product",
      });
    }
    res.json({
      success: true,
      message: "Xóa product thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa product",
      error: (error as Error).message,
    });
  }
};
