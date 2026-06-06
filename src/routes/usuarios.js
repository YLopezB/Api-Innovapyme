import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import listUsuarios from "../controller/usuarios/listUsuarios.js";
import changeUserRole from "../controller/usuarios/changeUserRole.js";
import deactivateUser from "../controller/usuarios/deactivateUser.js";
import reactivateUser from "../controller/usuarios/reactivateUser.js";

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

/**
 * @swagger
 * /api/usuarios/{id}/rol:
 *   put:
 *     summary: Cambiar rol de usuario (solo Admin)
 *     description: Permite a un Administrador actualizar el tipo de usuario (rol) de otro usuario.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_tipo_usuario
 *             properties:
 *               id_tipo_usuario:
 *                 type: integer
 *                 description: ID del tipo de usuario (1 Administrador, 2 Cliente, 3 Visitante)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
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
 *                       example: 5
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Pérez
 *                     correo:
 *                       type: string
 *                       example: juan.perez@example.com
 *                     telefono:
 *                       type: string
 *                       example: "3123456789"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2026-06-04T19:38:29.000Z"
 *                     id_tipo_usuario:
 *                       type: integer
 *                       example: 2
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
 *             examples:
 *               bodyVacio:
 *                 summary: Sin id_tipo_usuario
 *                 value:
 *                   success: false
 *                   message: Datos inválidos
 *               rolInvalido:
 *                 summary: id_tipo_usuario no es un entero válido
 *                 value:
 *                   success: false
 *                   message: id_tipo_usuario debe ser un entero válido
 *               rolNoExiste:
 *                 summary: Tipo de usuario inexistente
 *                 value:
 *                   success: false
 *                   message: id_tipo_usuario no existe
 *               campoNoPermitido:
 *                 summary: Campo no permitido en el body
 *                 value:
 *                   success: false
 *                   message: "Campo(s) no permitido(s): nombre"
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
 *                   example: Token no proveído
 *       403:
 *         description: Sin permiso
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
 *                   example: Sin permiso
 *       404:
 *         description: Usuario no encontrado
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
routerUsuarios.put("/:id/rol", verifyToken, isAdmin, changeUserRole);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Desactivar usuario
 *     description: |
 *       Marca el usuario como inactivo (`estado: false`). No elimina el registro de la base de datos.
 *       No permite desactivar usuarios con rol Administrador. Si el usuario ya está inactivo, responde 200 (idempotente).
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a desactivar
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario desactivado (o ya estaba inactivo)
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
 *                   example: Desactivado
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Pérez
 *                     correo:
 *                       type: string
 *                       example: juan.perez@example.com
 *                     telefono:
 *                       type: string
 *                       example: "3123456789"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2026-06-04T19:38:29.000Z"
 *                     id_tipo_usuario:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: No se puede desactivar un administrador
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
 *                   example: No puedes desactivar un administrador
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
 *                   example: Token no proveído
 *       403:
 *         description: Sin permiso
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
 *                   example: Sin permiso
 *       404:
 *         description: Usuario no encontrado
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
routerUsuarios.delete("/:id", verifyToken, isAdmin, deactivateUser);

/**
 * @swagger
 * /api/usuarios/{id}/reactivar:
 *   patch:
 *     summary: Reactivar usuario
 *     description: |
 *       Marca el usuario como activo (`estado: true`). Si el usuario ya está activo, responde 200 (idempotente).
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a reactivar
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario reactivado (o ya estaba activo)
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
 *                   example: Reactivado
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Pérez
 *                     correo:
 *                       type: string
 *                       example: juan.perez@example.com
 *                     telefono:
 *                       type: string
 *                       example: "3123456789"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       example: "2026-06-04T19:38:29.000Z"
 *                     id_tipo_usuario:
 *                       type: integer
 *                       example: 2
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
 *                   example: Token no proveído
 *       403:
 *         description: Sin permiso
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
 *                   example: Sin permiso
 *       404:
 *         description: Usuario no encontrado
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
routerUsuarios.patch("/:id/reactivar", verifyToken, isAdmin, reactivateUser);

export default routerUsuarios;
