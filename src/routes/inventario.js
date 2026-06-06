import { Router } from "express";
import listInventario from "../controller/inventario/listInventario.js";
import getInventarioById from "../controller/inventario/getInventarioById.js";
import createInventario from "../controller/inventario/createInventario.js";
import updateInventario from "../controller/inventario/updateInventario.js";
import deleteInventario from "../controller/inventario/deleteInventario.js";
import verifyToken from "../middlewares/verifyToken.js";
import alertProducto from "../controller/inventario/alertProducto.js";

const routerInventario = Router();

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de productos en inventario. Requiere token JWT válido para todas las rutas.
 */

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     summary: Listar productos paginados
 *     description: Retorna `{ data, meta }` con los productos del inventario.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Producto 1"
 *                       descripcion:
 *                         type: string
 *                         example: "Descripción del producto 1"
 *                       cantidad:
 *                         type: integer
 *                         example: 10
 *                       precio_unitario:
 *                         type: number
 *                         example: 100.00
 *                       categoria:
 *                         type: string
 *                         example: "Categoria 1"
 *                       fecha_creacion:
 *                         type: string
 *                         example: "2021-01-01"
 *                       fecha_actualizacion:
 *                         type: string
 *                         example: "2021-01-01"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total_pages:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Producto 1"
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción del producto 1"
 *                     cantidad:
 *                       type: integer
 *                       example: 10
 *                     precio_unitario:
 *                       type: number
 *                       example: 100.00
 *                     categoria:
 *                       type: string
 *                       example: "Categoria 1"
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2021-01-01"
 *                     fecha_actualizacion:
 *                       type: string
 *                       example: "2021-01-01"
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No encontrado
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   put:
 *     summary: Actualizar datos del producto
 *     description: Actualización parcial; `fecha_actualizacion` la gestiona Prisma.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Actualizado
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Producto 1"
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción del producto 1"
 *                     cantidad:
 *                       type: integer
 *                       example: 10
 *                     precio_unitario:
 *                       type: number
 *                       example: 100.00
 *                     categoria:
 *                       type: string
 *                       example: "Categoria 1"
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2021-01-01"
 *                     fecha_actualizacion:
 *                       type: string
 *                       example: "2021-01-01"
 *       400:
 *         description: Datos inválidos o cuerpo vacío
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El nombre no puede estar vacío
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No encontrado
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     description: No elimina si existen ventas asociadas a ese inventario.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Eliminado
 *       400:
 *         description: Tiene ventas asociadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tiene ventas
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No encontrado
 */

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     summary: Crear producto en inventario
 *     description: Registra el producto y genera un historial asociado al usuario autenticado.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cantidad
 *               - precio_unitario
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto (en BD se guarda como nombre_producto)
 *               descripcion:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Producto creado
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Producto 1"
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción del producto 1"
 *                     cantidad:
 *                       type: integer
 *                       example: 10
 *                     precio_unitario:
 *                       type: number
 *                       example: 100.00
 *                     categoria:
 *                       type: string
 *                       example: "Categoria 1"
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2021-01-01"
 *                     fecha_actualizacion:
 *                       type: string
 *                       example: "2021-01-01"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El nombre es requerido
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 *
 */

/**
 * @swagger
 * /api/inventario/alertas:
 *   get:
 *     summary: Listar productos en alerta por bajo stock
 *     description: Retorna productos con cantidad menor o igual al stock especificado (por defecto 5).
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: stock
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Umbral de stock para alerta
 *     responses:
 *       200:
 *         description: Lista de productos en alerta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lista de productos en alerta
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Producto 1"
 *                       descripcion:
 *                         type: string
 *                         example: "Descripción del producto 1"
 *                       cantidad:
 *                         type: integer
 *                         example: 3
 *                       precio_unitario:
 *                         type: number
 *                         example: 100.00
 *                       categoria:
 *                         type: string
 *                         example: "Categoria 1"
 *                       fecha_creacion:
 *                         type: string
 *                         example: "2021-01-01"
 *                       fecha_actualizacion:
 *                         type: string
 *                         example: "2021-01-01"
 *       401:
 *         description: Token no proveído o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token no proveído o inválido
 */

routerInventario.get("/", verifyToken, listInventario);
routerInventario.get("/alertas", verifyToken, alertProducto);
routerInventario.get("/:id", verifyToken, getInventarioById);
routerInventario.post("/", verifyToken, createInventario);
routerInventario.put("/:id", verifyToken, updateInventario);
routerInventario.delete("/:id", verifyToken, deleteInventario);

export default routerInventario;
