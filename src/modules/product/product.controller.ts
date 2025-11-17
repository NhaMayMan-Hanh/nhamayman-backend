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
import { IProduct } from "./product.model";
import { buildImageUrl } from "../../utils/buildImageUrl";

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const { category: slug, search } = req.query;
    const isAdmin = req.user?.role === "admin";
    let categoryName: string | undefined;

    // Chỉ filter category/search cho client (admin gọi empty query để lấy full)
    if (slug && !isAdmin) {
      const category = await getCategoryBySlug(slug as string);
      if (!category) {
        return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
      }
      categoryName = category.name;
    }

    // Luôn exclude cho list (nhẹ)
    const products = await getAllProducts(
      { category: categoryName, search: search as string },
      { excludeFields: ["description", "detailedDescription"] }
    );

    const responseData = products.map((p) => ({
      ...p.toObject(),
      image: buildImageUrl(p.image),
    }));

    res.json({
      success: true,
      message: "Lấy sản phẩm thành công",
      data: responseData, // Shape: _id, name, price, category, image, stock (không description)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm",
      error: (error as Error).message,
    });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user?.role === "admin";

    const product = await getProductById(req.params.id); // Full fields, không exclude
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    let responseData: { product: IProduct; relatedProducts?: IProduct[] } = { product }; // product full (có description)

    // Chỉ thêm related cho client (và related exclude description để nhẹ)
    if (!isAdmin) {
      const related = await getRelatedProducts(product.category, product._id as string, {
        excludeFields: ["description", "detailedDescription"],
        limit: 4,
      });
      responseData.relatedProducts = related;
    }

    res.json({
      success: true,
      message: "Lấy sản phẩm chi tiết thành công",
      data: responseData,
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
    if (req.file) {
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    const newProduct = await createProduct(req.body);
    // Trả full URL cho client (nếu cần, hoặc client tự prepend)
    const responseData = {
      ...newProduct.toObject(),
      image: `${process.env.ASSET_BASE_URL || ""}${req.body.image}`,
    };

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: responseData,
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
    let updateData = req.body;
    if (req.file) {
      // Optional: Xóa file cũ nếu có product cũ
      const oldProduct = await getProductById(req.params.id);
      if (oldProduct?.image && oldProduct.image.startsWith("/uploads/products/")) {
        const fs = require("fs");
        const oldPath = `.${oldProduct.image}`; // Full server path
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); // Xóa file cũ
      }
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await updateProduct(req.params.id, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Không tìm thấy product" });
    }

    // Trả full URL
    const responseData = {
      ...updatedProduct.toObject(),
      image: `${process.env.ASSET_BASE_URL || ""}${updatedProduct.image}`,
    };

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: responseData,
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
