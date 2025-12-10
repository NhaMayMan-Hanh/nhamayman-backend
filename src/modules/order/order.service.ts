import Order, { IOrder } from "./order.model";
import Product from "../product/product.model";
import notificationService from "../notification/notification.service";
import mongoose from "mongoose";

// ===== STOCK MANAGEMENT FUNCTIONS =====

/**
 * Kiểm tra và dự trữ stock cho order
 * Sử dụng MongoDB transaction để đảm bảo atomicity
 */
const reserveStock = async (
  items: Array<{ productId: string; quantity: number }>,
  session: mongoose.ClientSession
): Promise<void> => {
  // Validate tất cả products trước
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);

    if (!product) {
      throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm, không đủ số lượng yêu cầu (${item.quantity})`
      );
    }
  }

  // Trừ stock cho tất cả products
  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        stock: { $gte: item.quantity }, // Điều kiện: stock phải đủ
      },
      {
        $inc: { stock: -item.quantity }, // Trừ stock
      },
      {
        session,
        new: true,
      }
    );

    // Nếu không update được = stock đã thay đổi (race condition)
    if (!result) {
      const product = await Product.findById(item.productId).session(session);
      throw new Error(
        `Sản phẩm "${product?.name || item.productId}" đã hết hàng hoặc không đủ số lượng`
      );
    }
  }
};

/**
 * Hoàn trả stock khi cancel order
 */
const restoreStock = async (
  items: Array<{ productId: mongoose.Types.ObjectId; quantity: number }>,
  session: mongoose.ClientSession
): Promise<void> => {
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      {
        $inc: { stock: item.quantity }, // Cộng lại stock
      },
      { session }
    );
  }
};

// ===== ORDER CRUD FUNCTIONS =====

export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Dự trữ stock
    await reserveStock(
      (orderData.items || []).map((item) => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      })),
      session
    );
    // 2. Tạo order
    const newOrder = new Order(orderData);
    await newOrder.save({ session });

    // 3. Commit transaction
    await session.commitTransaction();

    return newOrder;
  } catch (error) {
    // Rollback nếu có lỗi
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrdersByUserId = async (
  userId: string,
  query: { status?: string; search?: string } = {}
): Promise<IOrder[]> => {
  let filter: any = { userId };
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      {
        "shippingAddress.fullName": { $regex: query.search, $options: "i" },
      },
      { _id: { $regex: query.search, $options: "i" } },
    ];
  }
  return Order.find(filter).sort({ createdAt: -1 }).populate("items.productId", "name price image");
};

// Helper: Tìm đơn hàng theo ID
const findOrderById = async (orderId: string): Promise<IOrder> => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }
  return order;
};

// Helper: Kiểm tra quyền sở hữu đơn hàng
const verifyOrderOwnership = (order: IOrder, userId: string): void => {
  if (order.userId.toString() !== userId) {
    throw new Error("Bạn không có quyền hủy đơn hàng này");
  }
};

// Helper: Kiểm tra trạng thái có thể hủy
const validateCancellableStatus = (order: IOrder): void => {
  if (order.status !== "pending") {
    throw new Error(
      `Không thể hủy đơn hàng ở trạng thái "${order.status}". Chỉ có thể hủy đơn hàng đang "Chờ xác nhận".`
    );
  }
};

// Helper: Cập nhật trạng thái đơn hàng thành cancelled
const markOrderAsCancelled = async (
  order: IOrder,
  session: mongoose.ClientSession
): Promise<IOrder> => {
  order.status = "cancelled";
  await order.save({ session });
  return order.populate("items.productId", "name price image");
};

// User: Cancel order với restore stock
export const cancelOrder = async (orderId: string, userId: string): Promise<IOrder | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await findOrderById(orderId);
    verifyOrderOwnership(order, userId);
    validateCancellableStatus(order);

    // 1. Hoàn trả stock
    await restoreStock(order.items, session);

    // 2. Đánh dấu order là cancelled
    const cancelledOrder = await markOrderAsCancelled(order, session);

    // 3. Commit transaction
    await session.commitTransaction();

    // 4. Gửi thông báo (sau khi commit)
    try {
      await notificationService.notifyOrderStatus(orderId, userId, null, "cancelled", {
        cancelledBy: "user",
      });
    } catch (notifError) {
      console.error("Lỗi khi gửi thông báo:", notifError);
    }

    return cancelledOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Admin: Get all orders
export const getAllOrders = async (
  query: { status?: string; search?: string; userId?: string } = {}
): Promise<IOrder[]> => {
  let filter: any = {};
  if (query.status) filter.status = query.status;
  if (query.userId) filter.userId = query.userId;
  if (query.search) {
    filter.$or = [
      {
        "shippingAddress.fullName": { $regex: query.search, $options: "i" },
      },
      { _id: { $regex: query.search, $options: "i" } },
    ];
  }
  return Order.find(filter).sort({ createdAt: -1 }).populate("items.productId", "name price image");
};

// Admin: Get by ID
export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return Order.findById(id).populate("items.productId", "name price image");
};

// Admin: Update order với xử lý stock khi cancel
export const updateOrder = async (
  id: string,
  updateData: Partial<IOrder>
): Promise<IOrder | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const currentOrder = await Order.findById(id).session(session);

    if (!currentOrder) {
      throw new Error("Đơn hàng không tồn tại");
    }

    const oldStatus = currentOrder.status;

    // Nếu admin cancel order => hoàn trả stock
    if (updateData.status === "cancelled" && oldStatus !== "cancelled") {
      await restoreStock(currentOrder.items, session);
    }

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    }).populate("items.productId", "name price image");

    if (!updatedOrder) {
      throw new Error("Cập nhật đơn hàng thất bại");
    }

    await session.commitTransaction();

    // Gửi thông báo (sau khi commit)
    if (updateData.status && updateData.status !== oldStatus) {
      const notificationStatuses = ["confirmed", "shipping", "delivered", "cancelled"];

      if (notificationStatuses.includes(updateData.status)) {
        try {
          await notificationService.notifyOrderStatus(
            id,
            updatedOrder.userId.toString(),
            null,
            updateData.status as "confirmed" | "shipping" | "delivered" | "cancelled",
            { previousStatus: oldStatus, updatedBy: "admin" }
          );
        } catch (notifError) {
          console.error("Lỗi khi gửi thông báo:", notifError);
        }
      }
    }

    return updatedOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Admin: Delete order (chỉ xóa order đã cancelled)
export const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const order = await Order.findById(id);

  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }

  const deletableStatuses = ["cancelled"];

  if (!deletableStatuses.includes(order.status)) {
    throw new Error(
      `Không thể xóa đơn hàng ở trạng thái "${order.status}". Chỉ có thể xóa đơn hàng ở trạng thái "Đã hủy".`
    );
  }

  return Order.findByIdAndDelete(id);
};
