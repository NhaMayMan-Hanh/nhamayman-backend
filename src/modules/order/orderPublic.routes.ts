import { Router } from "express";
import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./order.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate, validateQuery } from "@/middlewares/validation.middleware";
import { validateStockAvailability } from "@/middlewares/stock.middleware";
import { createOrderSchema, getOrdersQuerySchema } from "./validation.schemas";

const router = Router();

router.use(authenticate);

// POST /orders - Thêm stock validation middleware
router.post(
  "/",
  validate(createOrderSchema),
  validateStockAvailability, // Kiểm tra stock trước khi tạo order
  createOrderController
);

// GET /orders (user's orders)
router.get("/", validateQuery(getOrdersQuerySchema), getOrdersController);

// GET /orders/:id
router.get("/:id", getOrderByIdController);

// PATCH /orders/:id/cancel
router.patch("/:id/cancel", cancelOrderController);

export default router;
