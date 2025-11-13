import { Router } from "express";
import { createOrderController, getOrdersController } from "./order.controller";
import { protect } from "../../middlewares/auth.middleware"; // Import protect

const router = Router();

// Apply protect for all order routes
router.use(protect);

// POST /orders - Tạo order từ cart
router.post("/", createOrderController);

// GET /orders - Lấy orders của user
router.get("/", getOrdersController);

export default router;
