import { Router } from "express";
import listInventario from "../controller/inventario/listInventario.js";
import getInventarioById from "../controller/inventario/getInventarioById.js";
import createInventario from "../controller/inventario/createInventario.js";

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

routerInventario.get("/", listInventario);
routerInventario.post("/", createInventario);
routerInventario.get("/:id", getInventarioById);

export default routerInventario;
