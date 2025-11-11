// src/modules/order/order.service.ts (Service - create/get orders)
import Order, { IOrder } from "./order.model";

export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<IOrder | null> => {
  return Order.findByIdAndUpdate(orderId, { status }, { new: true });
};
