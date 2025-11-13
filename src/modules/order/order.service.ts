import Order, { IOrder } from "./order.model";

export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};
