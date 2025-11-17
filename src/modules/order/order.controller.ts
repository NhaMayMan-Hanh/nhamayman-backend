import { Request, Response } from "express";
import {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "./order.service";

// User: POST create order
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderData = { ...req.body, userId };
    const newOrder = await createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Tạo order thành công",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// User: GET user's orders
export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, search } = req.query;
    const orders = await getOrdersByUserId(userId, {
      status: status as string,
      search: search as string,
    });

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

// Admin: GET all orders
export const getAllOrdersAdminController = async (req: Request, res: Response) => {
  try {
    const { status, search, userId } = req.query;
    const orders = await getAllOrders({
      status: status as string,
      search: search as string,
      userId: userId as string,
    });

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

// Admin: GET order by ID
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy order" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Admin: PUT update order (e.g., status)
export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await updateOrder(req.params.id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Không tìm thấy order" });
    }

    res.json({
      success: true,
      message: "Cập nhật order thành công",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Admin: DELETE order
export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await deleteOrder(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Không tìm thấy order" });
    }
    res.json({
      success: true,
      message: "Xóa order thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
