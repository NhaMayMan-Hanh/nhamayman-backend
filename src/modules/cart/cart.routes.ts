import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  removeMultipleFromCartController,
  clearCartController,
} from "./cart.controller";

const router = Router();

router.use(authenticate);

router.get("/", getCartController);
router.post("/", addToCartController);
router.put("/", updateCartItemController);

// IMPORTANT: Batch delete MUST come BEFORE single delete
router.post("/batch-delete", removeMultipleFromCartController);

router.delete("/:productId", removeFromCartController);
router.delete("/", clearCartController);

export default router;
