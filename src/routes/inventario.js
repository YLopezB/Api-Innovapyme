import { Router } from "express";
import listInventario from "../controller/inventario/listInventario.js";

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

routerInventario.get("/", listInventario);

export default routerInventario;
