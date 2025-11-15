/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - username
 *         - email
 *         - role
 *         - isVerified
 *       properties:
 *         _id:
 *           type: string
 *           description: ID duy nhất của người dùng
 *         name:
 *           type: string
 *           description: Tên đầy đủ của người dùng
 *         username:
 *           type: string
 *           description: Tên đăng nhập duy nhất
 *         email:
 *           type: string
 *           format: email
 *           description: Địa chỉ email
 *         avatar:
 *           type: string
 *           description: URL ảnh đại diện
 *           default: /img/default-avatar.jpg
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Vai trò của người dùng
 *           default: user
 *         isVerified:
 *           type: boolean
 *           description: Trạng thái xác thực email
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật
 *     AuthResponse:
 *       type: object
 *       required:
 *         - token
 *         - user
 *       properties:
 *         token:
 *           type: string
 *           description: JWT access token
 *         user:
 *           $ref: '#/components/schemas/User'
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Thông báo
 */
