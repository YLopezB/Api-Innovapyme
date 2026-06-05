import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import listUsuarios from "../controller/usuarios/listUsuarios.js";

const routerUsuarios = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema (solo Administrador).
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
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
 *                         example: "Juan"
 *                       apellido:
 *                         type: string
 *                         example: "Pérez"
 *                       correo:
 *                         type: string
 *                         example: "juan.perez@example.com"
 *                       telefono:
 *                         type: string
 *                         example: "3123456789"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       fecha_creacion:
 *                         type: string
 *                         example: "2026-06-04T19:38:29.000Z"
 *                       id_tipo_usuario:
 *                         type: integer
 *                         example: 3
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
 *                   example: "Token no proveído"
 *       403:
 *         description: Sin permiso / no autorizado
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
 *                   example: "Sin permiso"
 */
routerUsuarios.get("/", verifyToken, isAdmin, listUsuarios);

export default routerUsuarios;
