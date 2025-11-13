import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "./cart.controller";

const router = Router();

// Áp dụng protect cho tất cả routes cần auth
router.get("/", protect, getCartController);
router.post("/", protect, addToCartController);
router.put("/", protect, updateCartItemController);
router.delete("/:productId", protect, removeFromCartController);
router.delete("/", protect, clearCartController);

export default router;
