import { Router } from "express";
import listInventario from "../controller/inventario/listInventario.js";
import getInventarioById from "../controller/inventario/getInventarioById.js";
import createInventario from "../controller/inventario/createInventario.js";
import updateInventario from "../controller/inventario/updateInventario.js";
import deleteInventario from "../controller/inventario/deleteInventario.js";
import verifyToken from "../middlewares/verifyToken.js";

const routerInventario = Router();

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de productos en inventario. La protección JWT se añadirá al integrar la base de autenticación (rama auth/JWT).
 */

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     summary: Listar productos paginados
 *     description: Retorna `{ data, meta }`. Agregar middleware JWT en punto 1.
 *     tags: [Inventario]
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
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   put:
 *     summary: Actualizar datos del producto
 *     description: Actualización parcial; `fecha_actualizacion` la gestiona Prisma (@updatedAt).
 *     tags: [Inventario]
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
 *       400:
 *         description: Datos inválidos o cuerpo vacío
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/inventario/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     description: No elimina si existen ventas asociadas a ese inventario.
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado
 *       400:
 *         description: Tiene ventas asociadas
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     summary: Crear producto en inventario
 *     description: Registra el producto y una entrada en Historial. `id_usuario` es temporal hasta que el JWT rellene el usuario (punto 1).
 *     tags: [Inventario]
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
 *               - id_usuario
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario que realiza la acción (temporal sin JWT)
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
 *       400:
 *         description: Datos inválidos
 */

routerInventario.get("/", verifyToken, listInventario);
routerInventario.post("/", verifyToken, createInventario);
routerInventario.get("/:id", verifyToken, getInventarioById);
routerInventario.put("/:id", verifyToken, updateInventario);
routerInventario.delete("/:id", verifyToken, deleteInventario);

export default routerInventario;
