/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: API quản lý bài viết blog (public và admin)
 */

/**
 * @swagger
 * /api/client/blogs:
 *   get:
 *     summary: Lấy danh sách tất cả blogs (public)
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tìm kiếm theo tiêu đề hoặc mô tả
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogsResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/client/blogs/{slug}:
 *   get:
 *     summary: Lấy chi tiết một blog theo slug (public)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           description: Slug blog
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       404:
 *         description: Không tìm thấy blog
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/blogs:
 *   get:
 *     summary: Lấy danh sách tất cả blogs (admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tìm kiếm theo tiêu đề hoặc mô tả
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogsResponse'
 *       401:
 *         description: Không được phép (không phải admin)
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   get:
 *     summary: Lấy chi tiết một blog (admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID blog
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy blog
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/blogs:
 *   post:
 *     summary: Tạo blog mới (admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: File hình ảnh thumbnail (jpg, png, max 3MB)
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Tiêu đề blog
 *               slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: '^[a-z0-9-]+$'
 *                 description: Slug blog
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Mô tả ngắn
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10000
 *                 description: Nội dung HTML từ CKEditor
 *             required:
 *               - name
 *               - slug
 *               - content
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       400:
 *         description: Yêu cầu không hợp lệ (file sai/slug duplicate)
 *       401:
 *         description: Không được phép
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   put:
 *     summary: Cập nhật blog (admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID blog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: File hình ảnh mới (optional, max 3MB)
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: '^[a-z0-9-]+$'
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10000
 *             description: Các trường cần cập nhật (partial)
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy blog
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   delete:
 *     summary: Xóa blog (admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID blog
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy blog
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
