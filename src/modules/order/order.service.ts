import Order, { IOrder } from "./order.model";

export const createOrder = async (
   orderData: Partial<IOrder>
): Promise<IOrder> => {
   const newOrder = new Order(orderData);
   return newOrder.save();
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
   return Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image");
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
const markOrderAsCancelled = async (order: IOrder): Promise<IOrder> => {
   order.status = "cancelled";
   await order.save();
   return order.populate("items.productId", "name price image");
};

// User: Cancel order (chỉ cho phép hủy khi status = pending)
export const cancelOrder = async (
   orderId: string,
   userId: string
): Promise<IOrder | null> => {
   // Tìm đơn hàng
   const order = await findOrderById(orderId);

   // Kiểm tra quyền sở hữu
   verifyOrderOwnership(order, userId);

   // Kiểm tra trạng thái có thể hủy
   validateCancellableStatus(order);

   // Cập nhật trạng thái thành cancelled
   return markOrderAsCancelled(order);
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
   return Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image");
};

// Admin: Get by ID
export const getOrderById = async (id: string): Promise<IOrder | null> => {
   return Order.findById(id).populate("items.productId", "name price image");
};

// Admin: Update order (e.g., status)
export const updateOrder = async (
   id: string,
   updateData: Partial<IOrder>
): Promise<IOrder | null> => {
   return Order.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "items.productId",
      "name price image"
   );
};

// Admin: Delete/cancel order
export const deleteOrder = async (id: string): Promise<IOrder | null> => {
   // Kiểm tra đơn hàng tồn tại
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
