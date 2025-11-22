import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "./cart.controller";

const router = Router();

router.use(authenticate);

router.get("/", getCartController);
router.post("/", addToCartController);
router.put("/", updateCartItemController);
router.delete("/:productId", removeFromCartController);
router.delete("/", clearCartController);

export default router;
