/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - image
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         detailedDescription:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         image:
 *           type: string
 *         stock:
 *           type: number
 *       example:
 *         id: "67345124abced9"
 *         name: "Iphone 15"
 *         description: "Điện thoại mới nhất"
 *         detailedDescription: "Thông tin chi tiết..."
 *         price: 25000000
 *         category: "smartphone"
 *         image: "iphone15.jpg"
 *         stock: 10
 */
