import { Router } from "express";
import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./order.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate, validateQuery } from "@/middlewares/validation.middleware";
import { createOrderSchema, getOrdersQuerySchema } from "./validation.schemas";

const router = Router();

router.use(authenticate);

// POST /orders (create order)
router.post("/", validate(createOrderSchema), createOrderController);

// GET /orders (user's orders, optional ?status=pending&search=John)
router.get("/", validateQuery(getOrdersQuerySchema), getOrdersController);

// GET /orders/:id
router.get("/:id", getOrderByIdController);

// PATCH /orders/:id/cancel (cancel order - user only)
router.patch("/:id/cancel", cancelOrderController);
export default router;
