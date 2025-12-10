import { Request, Response, NextFunction } from "express";
import Product from "../modules/product/product.model";

/**
 * Middleware kiểm tra stock trước khi tạo order
 * Validate ngay từ đầu để fail-fast và tránh lãng phí transaction
 */
export const validateStockAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    // Kiểm tra từng sản phẩm
    const stockErrors: string[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).select("name stock");

      if (!product) {
        stockErrors.push(`Sản phẩm ${item.productId} không tồn tại`);
        continue;
      }

      if (product.stock < item.quantity) {
        stockErrors.push(
          `"${product.name}" chỉ còn ${product.stock} sản phẩm (yêu cầu: ${item.quantity})`
        );
      }
    }

    // Nếu có lỗi về stock
    if (stockErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Một số sản phẩm không đủ hàng",
        errors: stockErrors,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra tồn kho",
      error: (error as Error).message,
    });
  }
};
