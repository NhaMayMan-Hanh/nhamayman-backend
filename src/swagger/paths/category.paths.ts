/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API quản lý danh mục sản phẩm (public và admin)
 */

/**
 * @swagger
 * /api/client/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục (public)
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tìm kiếm theo tên danh mục
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Tìm kiếm theo tên danh mục
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
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
 * /api/admin/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết một danh mục (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID danh mục
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Tạo danh mục mới (admin only)
 *     tags: [Category]
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
 *                 description: File hình ảnh danh mục (jpg, png, max 2MB)
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Tên danh mục
 *               slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: '^[a-z0-9-]+$'
 *                 description: Slug danh mục
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Mô tả
 *             required:
 *               - name
 *               - slug
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Yêu cầu không hợp lệ (file sai định dạng/slug duplicate)
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
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID danh mục
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
 *                 description: File hình ảnh mới (optional, max 2MB)
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
 *             description: Các trường cần cập nhật (partial)
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID danh mục
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
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
