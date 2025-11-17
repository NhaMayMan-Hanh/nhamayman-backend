/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của danh mục
 *         name:
 *           type: string
 *           description: Tên danh mục
 *         img:
 *           type: string
 *           format: uri
 *           description: URL hình ảnh danh mục
 *         slug:
 *           type: string
 *           description: Slug cho URL (lowercase, unique)
 *         description:
 *           type: string
 *           description: Mô tả danh mục
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
 *       example:
 *         _id: "6919ee608c0ff79141b04a1f"
 *         name: "Smartphone"
 *         img: "http://localhost:5000/uploads/categories/category-123.jpg"
 *         slug: "smartphone"
 *         description: "Danh mục điện thoại thông minh"
 *         createdAt: "2025-11-17T00:26:00.000Z"
 *         updatedAt: "2025-11-17T00:26:00.000Z"
 *
 *     CreateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tên danh mục
 *         slug:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           pattern: '^[a-z0-9-]+$'
 *           description: Slug danh mục
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Mô tả
 *       required:
 *         - name
 *         - slug
 *       example:
 *         name: "Smartphone"
 *         slug: "smartphone"
 *         description: "Danh mục điện thoại thông minh"
 *
 *     UpdateCategoryRequest:
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
 *       description: Các trường cần cập nhật (partial)
 *       example:
 *         name: "Smartphone Updated"
 *         slug: "smartphone"
 *         description: "Mô tả cập nhật"
 *
 *     CategoriesResponse:
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
 *             $ref: '#/components/schemas/Category'
 *       example:
 *         success: true
 *         message: "Lấy danh mục thành công"
 *         data: [ { ... } ]
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Category'
 *       example:
 *         success: true
 *         message: "Tạo danh mục thành công"
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
 *         message: "Xóa danh mục thành công"
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
 *         message: "Lỗi khi lấy danh mục"
 *         error: "Chi tiết lỗi"
 */
