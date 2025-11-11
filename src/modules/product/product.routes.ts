import { Router } from "express";
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./product.controller";

const router = Router();

// GET /products - Lấy tất cả products
router.get("/", getProductsController);

// GET /products/:id - Lấy product theo ID
router.get("/:id", getProductByIdController);

// POST /products - Tạo product mới (cho admin)
router.post("/", createProductController);

// PUT /products/:id - Cập nhật product (cho admin)
router.put("/:id", updateProductController);

// DELETE /products/:id - Xóa product (cho admin)
router.delete("/:id", deleteProductController);

export default router;
