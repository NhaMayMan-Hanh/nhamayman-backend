import { Router } from "express";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "./cart.controller";

const router = Router();

// GET /cart - Lấy giỏ hàng
router.get("/", getCartController);

// POST /cart - Thêm vào giỏ
router.post("/", addToCartController);

// PUT /cart - Cập nhật quantity
router.put("/", updateCartItemController);

// DELETE /cart/:productId - Xóa item
router.delete("/:productId", removeFromCartController);

// DELETE /cart - Xóa toàn bộ
router.delete("/", clearCartController);

export default router;
