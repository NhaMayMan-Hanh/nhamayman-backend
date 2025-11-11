// src/modules/order/order.controller.ts (Controller)
import { Request, Response } from "express";
import { createOrder, getOrdersByUserId, updateOrderStatus } from "./order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orderData = { ...req.body, userId };
    const newOrder = await createOrder(orderData);
    res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orders = await getOrdersByUserId(userId);
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
