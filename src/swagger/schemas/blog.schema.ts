/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của blog
 *         name:
 *           type: string
 *           description: Tiêu đề blog
 *         img:
 *           type: string
 *           format: uri
 *           description: URL hình ảnh thumbnail blog
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
 *         name: "Hướng dẫn chọn quà handmade ý nghĩa"
 *         img: "http://localhost:5000/uploads/blogs/blog-123.jpg"
 *         slug: "huong-dan-chon-qua-handmade-y-nghia"
 *         description: "Bài viết chia sẻ kinh nghiệm chọn quà handmade phù hợp cho mọi dịp."
 *         content: "<h2>Giới thiệu</h2><p>Nội dung chi tiết về quà handmade...</p>"
 *         createdAt: "2025-11-17T00:26:00.000Z"
 *         updatedAt: "2025-11-17T00:26:00.000Z"
 *
 *     CreateBlogRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Tiêu đề blog
 *         slug:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           pattern: '^[a-z0-9-]+$'
 *           description: Slug blog
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Mô tả ngắn
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *           description: Nội dung HTML từ CKEditor
 *       required:
 *         - name
 *         - slug
 *         - content
 *       example:
 *         name: "Hướng dẫn chọn quà handmade ý nghĩa"
 *         slug: "huong-dan-chon-qua-handmade-y-nghia"
 *         description: "Bài viết chia sẻ kinh nghiệm chọn quà handmade phù hợp cho mọi dịp."
 *         content: "<h2>Giới thiệu</h2><p>Nội dung chi tiết...</p>"
 *
 *     UpdateBlogRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
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
 *         name: "Hướng dẫn chọn quà handmade ý nghĩa (Updated)"
 *         slug: "huong-dan-chon-qua-handmade-y-nghia"
 *         description: "Mô tả cập nhật"
 *         content: "<h2>Cập nhật</h2><p>Nội dung mới...</p>"
 *
 *     BlogsResponse:
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
 *             $ref: '#/components/schemas/Blog'
 *       example:
 *         success: true
 *         message: "Lấy blogs thành công"
 *         data: [ { ... } ]
 *
 *     BlogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Blog'
 *       example:
 *         success: true
 *         message: "Tạo blog thành công"
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
 *         message: "Xóa blog thành công"
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
 *         message: "Lỗi khi lấy blog"
 *         error: "Chi tiết lỗi"
 */
