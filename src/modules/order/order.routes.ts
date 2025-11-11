// src/modules/order/order.routes.ts
import { Router } from "express";
import { createOrderController, getOrdersController } from "./order.controller";

const router = Router();

// POST /orders - Tạo order từ cart
router.post("/", createOrderController);

// GET /orders - Lấy orders của user
router.get("/", getOrdersController);

export default router;
