import { z } from "zod";

// Schema cho create order (từ cart)
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),
      quantity: z.number().int().positive("Số lượng phải > 0"),
      price: z.number().positive("Giá phải > 0"),
    })
  ),
  total: z.number().positive("Tổng tiền phải > 0"),
  shippingAddress: z.object({
    fullName: z.string().min(2, "Họ tên không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    address: z.string().min(5, "Địa chỉ không hợp lệ"),
    city: z.string().min(2, "Thành phố không hợp lệ"),
    country: z.string().default("Việt Nam"),
  }),
  paymentMethod: z.enum(["cash", "card", "bank_transfer"], {
    message: "Phương thức thanh toán không hợp lệ",
  }),
});

// Schema cho update order (admin: chủ yếu status)
export const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"], {
      message: "Trạng thái không hợp lệ",
    })
    .optional(),
  // Có thể thêm fields khác nếu cần (e.g., trackingNumber)
});

// Query cho GET list (user/admin: optional status, search)
export const getOrdersQuerySchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
  search: z.string().min(1).max(100).optional(), // Tìm theo fullName hoặc order ID
});

// ID schema cho :id
export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID order không hợp lệ"),
  }),
});
