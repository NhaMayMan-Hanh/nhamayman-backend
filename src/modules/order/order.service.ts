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
