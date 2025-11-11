import { Request, Response } from "express";
import {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cart.service";

export const getCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || "guest"; // Giả sử req.user từ auth middleware, fallback guest
    const cart = await getCartByUserId(userId);
    res.json({
      success: true,
      data: cart || { items: [], total: 0 },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy giỏ hàng",
      error: (error as Error).message,
    });
  }
};

export const addToCartController = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id || "guest";
    const updatedCart = await addToCart(userId, productId, quantity);
    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id || "guest";
    const updatedCart = await updateCartItem(userId, productId, quantity);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }
    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const removeFromCartController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id || "guest";
    const updatedCart = await removeFromCart(userId, productId);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }
    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const clearCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || "guest";
    const updatedCart = await clearCart(userId);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }
    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
