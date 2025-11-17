import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "./cart.controller";

const router = Router();

// Áp dụng authenticate cho tất cả routes cần auth
router.get("/", authenticate, getCartController);
router.post("/", authenticate, addToCartController);
router.put("/", authenticate, updateCartItemController);
router.delete("/:productId", authenticate, removeFromCartController);
router.delete("/", authenticate, clearCartController);

export default router;
