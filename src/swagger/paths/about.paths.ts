/**
 * @swagger
 * tags:
 *   name: About
 *   description: API quản lý trang about (public và admin)
 */

/**
 * @swagger
 * /api/client/about:
 *   get:
 *     summary: Lấy thông tin about (public)
 *     tags: [About]
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *           description: Slug để lấy about cụ thể
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutResponse'
 *       404:
 *         description: Không tìm thấy about
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/about:
 *   get:
 *     summary: Lấy danh sách tất cả about (admin only)
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutsResponse'
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
 * /api/admin/about/{id}:
 *   get:
 *     summary: Lấy chi tiết một about (admin only)
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID about
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutResponse'
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy about
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/about:
 *   post:
 *     summary: Tạo about mới (admin only)
 *     tags: [About]
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
 *                 description: File hình ảnh hero (jpg, png, max 5MB)
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Tên about
 *               slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: '^[a-z0-9-]+$'
 *                 description: Slug about
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
 *               $ref: '#/components/schemas/AboutResponse'
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
 * /api/admin/about/{id}:
 *   put:
 *     summary: Cập nhật about (admin only)
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID about
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
 *                 description: File hình ảnh mới (optional, max 5MB)
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
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
 *               $ref: '#/components/schemas/AboutResponse'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy about
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/about/{id}:
 *   delete:
 *     summary: Xóa about (admin only)
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID about
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
 *         description: Không tìm thấy about
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
