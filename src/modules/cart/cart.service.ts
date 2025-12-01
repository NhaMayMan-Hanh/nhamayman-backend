import Cart, { ICart } from "./cart.model";
import Product from "../product/product.model";
import { Types } from "mongoose";

export const getCartByUserId = async (userId: string): Promise<ICart | null> => {
  if (userId === "guest") return null;
  return Cart.findOne({ userId });
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<ICart> => {
  if (userId === "guest") {
    throw new Error("Guest cart handled in frontend");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [], total: 0 });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: new Types.ObjectId(productId),
      quantity,
      price: product.price,
    });
  }

  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return cart.save();
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  if (userId === "guest") {
    throw new Error("Guest cart handled in frontend");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex === -1) return cart;

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return cart.save();
};

export const removeFromCart = async (userId: string, productId: string): Promise<ICart | null> => {
  if (userId === "guest") {
    throw new Error("Guest cart handled in frontend");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return cart.save();
};

// NEW: Xóa nhiều items cùng lúc (tránh race condition)
export const removeMultipleFromCart = async (
  userId: string,
  productIds: string[]
): Promise<ICart | null> => {
  if (userId === "guest") {
    throw new Error("Guest cart handled in frontend");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  // Lọc bỏ tất cả items có productId trong danh sách
  cart.items = cart.items.filter((item) => !productIds.includes(item.productId.toString()));

  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return cart.save();
};

export const clearCart = async (userId: string): Promise<ICart | null> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = [];
  cart.total = 0;
  return cart.save();
};
