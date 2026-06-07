import { Router } from "express";
import listVentas from "../controller/ventas/listVentas.js";
import getVentaById from "../controller/ventas/getVentaById.js";
import createVenta from "../controller/ventas/createVenta.js";
import verifyToken from "../middlewares/verifyToken.js";

const routerVentas = Router();

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Gestión de ventas. Requiere token JWT válido para todas las rutas.
 */

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Listar ventas paginadas
 *     description: Retorna `{ data, meta }` con las ventas realizadas.
 *     tags: [Ventas]
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
 *                       clienteId:
 *                         type: integer
 *                         example: 1
 *                       productoId:
 *                         type: integer
 *                         example: 1
 *                       cantidad:
 *                         type: integer
 *                         example: 2
 *                       precioUnitario:
 *                         type: number
 *                         example: 10.50
 *                       total:
 *                         type: number
 *                         example: 21.00
 *                       fechaVenta:
 *                         type: string
 *                         example: "2023-10-27T10:00:00Z"
 *                       producto:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                           categoria:
 *                             type: string
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
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener venta por ID
 *     tags: [Ventas]
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
 *         description: Venta encontrada
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
 *                     clienteId:
 *                       type: integer
 *                       example: 1
 *                     productoId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                     precioUnitario:
 *                       type: number
 *                       example: 10.50
 *                     total:
 *                       type: number
 *                       example: 21.00
 *                     fechaVenta:
 *                       type: string
 *                       example: "2023-10-27T10:00:00Z"
 *                     producto:
 *                       type: object
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
 * /api/ventas:
 *   post:
 *     summary: Registrar venta y descontar stock
 *     description: Crea una o múltiples ventas (una por producto) y actualiza el stock de cada producto. Si algún producto no tiene stock suficiente, la venta no se realiza.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - productos
 *               - total
 *             properties:
 *               clienteId:
 *                 type: integer
 *                 description: ID del cliente (usuario)
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                     - precioUnitario
 *                   properties:
 *                     productoId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                     precioUnitario:
 *                       type: number
 *                       example: 10.50
 *               total:
 *                 type: number
 *                 example: 46.00
 *     responses:
 *       201:
 *         description: Venta(s) creada(s) exitosamente
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
 *                   example: Venta creada
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       clienteId:
 *                         type: integer
 *                         example: 1
 *                       productoId:
 *                         type: integer
 *                         example: 1
 *                       cantidad:
 *                         type: integer
 *                         example: 2
 *                       precioUnitario:
 *                         type: number
 *                         example: 10.50
 *                       total:
 *                         type: number
 *                         example: 21.00
 *                       fechaVenta:
 *                         type: string
 *                         example: "2023-10-27T10:00:00Z"
 *       400:
 *         description: Stock insuficiente, datos inválidos o cliente no existe
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
 *                   example: "Stock insuficiente para el producto con ID: 1. Stock disponible: 5, solicitado: 7"
 *                 errorCode:
 *                   type: string
 *                   example: INSUFFICIENT_STOCK
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

routerVentas.get("/", verifyToken, listVentas);
routerVentas.get("/:id", verifyToken, getVentaById);
routerVentas.post("/", verifyToken, createVenta);

export default routerVentas;
