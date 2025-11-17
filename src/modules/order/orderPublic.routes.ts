import { Router } from "express";
import { createOrderController, getOrdersController } from "./order.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate, validateQuery } from "../../middlewares/validation.middleware";
import { createOrderSchema, getOrdersQuerySchema } from "./validation.schemas";

const router = Router();

// Auth middleware cho toàn bộ (user level)
router.use(authenticate);

// POST /orders (create order)
router.post("/", validate(createOrderSchema), createOrderController);

// GET /orders (user's orders, optional ?status=pending&search=John)
router.get("/", validateQuery(getOrdersQuerySchema), getOrdersController);

export default router;
