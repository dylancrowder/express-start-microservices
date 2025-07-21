/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       500:
 *         description: Error al registrar usuario
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Autenticado correctamente (cookie seteada y respuesta JSON)
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el login
 */
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (elimina la cookie del token)
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verificar si el usuario está autenticado
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *       401:
 *         description: Token inválido o no autenticado
 */
