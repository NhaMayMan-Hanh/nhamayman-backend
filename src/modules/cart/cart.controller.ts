import { Request, Response } from "express";
import {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cart.service";

interface CartItemFlat {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const mapItemsToFlat = (items: any[]): CartItemFlat[] => {
  return items.map((item) => ({
    _id: item.productId._id.toString(),
    name: item.productId.name,
    price: item.price, // Item price (snapshot)
    image: item.productId.image,
    quantity: item.quantity,
  }));
};

export const getCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await getCartByUserId(userId);
    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], total: 0 },
      });
    }

    await cart.populate("items.productId", "name price image");

    res.json({
      success: true,
      message: "Successfully get cart",
      data: {
        ...cart.toObject(),
        items: mapItemsToFlat(cart.items), // Map to flat for FE
      },
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
    const userId = req.user!.id;

    const updatedCart = await addToCart(userId, productId, quantity);
    await updatedCart.populate("items.productId", "name price image");

    res.json({
      success: true,
      message: "The product has been added to your cart",
      data: {
        ...updatedCart.toObject(),
        items: mapItemsToFlat(updatedCart.items),
      },
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
    const userId = req.user!.id;

    const updatedCart = await updateCartItem(userId, productId, quantity);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    await updatedCart.populate("items.productId", "name price image");

    res.json({
      success: true,
      message: "The product has been updated in your cart",
      data: {
        ...updatedCart.toObject(),
        items: mapItemsToFlat(updatedCart.items),
      },
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
    const userId = req.user!.id;

    const updatedCart = await removeFromCart(userId, productId);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    await updatedCart.populate("items.productId", "name price image");

    res.json({
      success: true,
      message: "The product has been removed from your cart",
      data: {
        ...updatedCart.toObject(),
        items: mapItemsToFlat(updatedCart.items),
      },
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
    const userId = req.user!.id;

    const updatedCart = await clearCart(userId);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    res.json({
      success: true,
      message: "Successfully clear cart",
      data: {
        ...updatedCart.toObject(),
        items: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
