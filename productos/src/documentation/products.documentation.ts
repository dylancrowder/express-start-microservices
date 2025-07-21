/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Camiseta deportiva"
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 29.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Camiseta deportiva de alta calidad"
 *               image:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f8b8f5a8d3f40015a5e9f7"
 *         name:
 *           type: string
 *           example: "Camiseta deportiva"
 *         price:
 *           type: number
 *           example: 29.99
 *         stock:
 *           type: integer
 *           example: 100
 *         description:
 *           type: string
 *           example: "Camiseta deportiva de alta calidad"
 *         image:
 *           type: string
 *           example: "http://example.com/image.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-02T12:00:00Z"
 */
