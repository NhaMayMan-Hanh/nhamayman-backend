import { Router } from "express";
import {
  getAllOrdersAdminController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
} from "./order.controller";
import { authenticate, isAdmin } from "../../middlewares/auth.middleware";
import { validate, validateQuery, validateParams } from "../../middlewares/validation.middleware";
import { updateOrderSchema, getOrdersQuerySchema, orderIdSchema } from "./validation.schemas";

const router = Router();

// Auth + Admin middleware cho toàn bộ
router.use(authenticate, isAdmin);

// GET /admin/orders (all orders, optional ?status=shipped&search=John&userId=xxx)
router.get("/", validateQuery(getOrdersQuerySchema), getAllOrdersAdminController);

// GET /admin/orders/:id
router.get("/:id", validateParams(orderIdSchema), getOrderByIdController);

// PUT /admin/orders/:id (update status, etc.)
router.put(
  "/:id",
  validateParams(orderIdSchema),
  validate(updateOrderSchema),
  updateOrderController
);

// DELETE /admin/orders/:id
router.delete("/:id", validateParams(orderIdSchema), deleteOrderController);

export default router;
