/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: ID sản phẩm
 *         quantity:
 *           type: integer
 *           description: Số lượng
 *         price:
 *           type: number
 *           description: Giá đơn vị
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       example:
 *         productId: "691991b3ca1b2bde8175662b"
 *         quantity: 2
 *         price: 25000000
 *
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: Họ tên đầy đủ
 *         phone:
 *           type: string
 *           description: Số điện thoại
 *         address:
 *           type: string
 *           description: Địa chỉ chi tiết
 *         city:
 *           type: string
 *           description: Thành phố
 *         country:
 *           type: string
 *           description: Quốc gia
 *       required:
 *         - fullName
 *         - phone
 *         - address
 *         - city
 *       example:
 *         fullName: "Nguyễn Văn A"
 *         phone: "0123456789"
 *         address: "123 Đường ABC"
 *         city: "TP. Hồ Chí Minh"
 *         country: "Việt Nam"
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID order
 *         userId:
 *           type: string
 *           description: ID người dùng
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Danh sách sản phẩm
 *         total:
 *           type: number
 *           description: Tổng tiền
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *           description: Trạng thái order
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, bank_transfer]
 *           description: Phương thức thanh toán
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Ngày tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Ngày cập nhật
 *       required:
 *         - _id
 *         - userId
 *         - items
 *         - total
 *         - status
 *         - shippingAddress
 *         - paymentMethod
 *       example:
 *         _id: "691a08ce489cdc57e58271d7"
 *         userId: "user123"
 *         items: [ { productId: "prod123", quantity: 2, price: 25000000 } ]
 *         total: 50000000
 *         status: "pending"
 *         shippingAddress: { fullName: "Nguyễn Văn A", phone: "0123456789", address: "123 ABC", city: "HCM", country: "Việt Nam" }
 *         paymentMethod: "cash"
 *         createdAt: "2025-11-17T00:26:00.000Z"
 *         updatedAt: "2025-11-17T00:26:00.000Z"
 *
 *     CreateOrderRequest:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Danh sách sản phẩm từ cart
 *         total:
 *           type: number
 *           description: Tổng tiền
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, bank_transfer]
 *           description: Phương thức thanh toán
 *       required:
 *         - items
 *         - total
 *         - shippingAddress
 *         - paymentMethod
 *       example:
 *         items: [ { productId: "prod123", quantity: 2, price: 25000000 } ]
 *         total: 50000000
 *         shippingAddress: { fullName: "Nguyễn Văn A", phone: "0123456789", address: "123 ABC", city: "HCM", country: "Việt Nam" }
 *         paymentMethod: "cash"
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *           description: Trạng thái mới
 *       description: Các trường cần cập nhật (chủ yếu status)
 *       example:
 *         status: "confirmed"
 *
 *     OrdersResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Trạng thái thành công
 *         message:
 *           type: string
 *           description: Thông báo
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *       example:
 *         success: true
 *         message: "Lấy orders thành công"
 *         data: [ { ... } ]
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Order'
 *       example:
 *         success: true
 *         message: "Tạo order thành công"
 *         data: { ... }
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *       example:
 *         success: true
 *         message: "Xóa order thành công"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 *       example:
 *         success: false
 *         message: "Lỗi khi lấy order"
 *         error: "Chi tiết lỗi"
 */
