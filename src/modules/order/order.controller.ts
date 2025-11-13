import { Request, Response } from "express";
import { createOrder, getOrdersByUserId } from "./order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; // From protect middleware
    const orderData = { ...req.body, userId };
    const newOrder = await createOrder(orderData);
    await newOrder.populate("items.productId", "name price image"); // Populate for FE

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
    const userId = req.user!.id; // From protect
    const orders = await getOrdersByUserId(userId);
    // Populate all orders' items
    for (let order of orders) {
      await order.populate("items.productId", "name price image");
    }

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
