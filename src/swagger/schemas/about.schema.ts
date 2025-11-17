/**
 * @swagger
 * components:
 *   schemas:
 *     About:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của about
 *         name:
 *           type: string
 *           description: Tên about
 *         img:
 *           type: string
 *           format: uri
 *           description: URL hình ảnh about
 *         slug:
 *           type: string
 *           description: Slug cho URL (lowercase, unique)
 *         description:
 *           type: string
 *           description: Mô tả ngắn
 *         content:
 *           type: string
 *           description: Nội dung chi tiết (HTML)
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
 *         - name
 *         - img
 *         - slug
 *         - content
 *       example:
 *         _id: "691a08ce489cdc57e58271d7"
 *         name: "Về NhaMayMan-Hanh"
 *         img: "http://localhost:5000/uploads/about/about-123.jpg"
 *         slug: "ve-nhamayman-hanh"
 *         description: "Khám phá hành trình lan tỏa yêu thương qua những món quà handmade tinh tế của chúng tôi."
 *         content: "<h2>Giới thiệu về NhaMayMan-Hanh</h2><p>NhaMayMan-Hanh là cửa hàng chuyên về các sản phẩm handmade...</p>"
 *         createdAt: "2025-11-17T00:26:00.000Z"
 *         updatedAt: "2025-11-17T00:26:00.000Z"
 *
 *     CreateAboutRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tên about
 *         slug:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           pattern: '^[a-z0-9-]+$'
 *           description: Slug about
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Mô tả ngắn
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *           description: Nội dung HTML
 *       required:
 *         - name
 *         - slug
 *         - content
 *       example:
 *         name: "Về NhaMayMan-Hanh"
 *         slug: "ve-nhamayman-hanh"
 *         description: "Khám phá hành trình lan tỏa yêu thương qua những món quà handmade tinh tế của chúng tôi."
 *         content: "<h2>Giới thiệu</h2><p>Nội dung chi tiết...</p>"
 *
 *     UpdateAboutRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         slug:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           pattern: '^[a-z0-9-]+$'
 *         description:
 *           type: string
 *           maxLength: 500
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *       description: Các trường cần cập nhật (partial)
 *       example:
 *         name: "Về NhaMayMan-Hanh Updated"
 *         slug: "ve-nhamayman-hanh"
 *         description: "Mô tả cập nhật"
 *         content: "<h2>Cập nhật</h2><p>Nội dung mới...</p>"
 *
 *     AboutsResponse:
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
 *             $ref: '#/components/schemas/About'
 *       example:
 *         success: true
 *         message: "Lấy danh sách about thành công"
 *         data: [ { ... } ]
 *
 *     AboutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/About'
 *       example:
 *         success: true
 *         message: "Tạo about thành công"
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
 *         message: "Xóa about thành công"
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
 *         message: "Lỗi khi lấy about"
 *         error: "Chi tiết lỗi"
 */
