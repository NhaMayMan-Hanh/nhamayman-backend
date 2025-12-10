import { Request, Response } from "express";
import {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder,
} from "./order.service";
import { clearCart } from "../cart/cart.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderData = { ...req.body, userId };
    const newOrder = await createOrder(orderData);

    await clearCart(userId);

    res.status(201).json({
      success: true,
      message: "Successfully create order",
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
      message: "Successfully get orders",
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
      message: "Successfully get orders",
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
      message: "Successfully get order",
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
      message: "Successfully update order",
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
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({
      success: true,
      message: "Successfully delete order",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// User: PATCH cancel order
export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id;

    const cancelledOrder = await cancelOrder(orderId, userId);

    res.json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: cancelledOrder,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    // Trả về status code phù hợp
    if (errorMessage.includes("không tồn tại")) {
      return res.status(404).json({
        success: false,
        message: errorMessage,
      });
    }

    if (errorMessage.includes("không có quyền") || errorMessage.includes("không thuộc về")) {
      return res.status(403).json({
        success: false,
        message: errorMessage,
      });
    }

    if (errorMessage.includes("không thể hủy")) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
