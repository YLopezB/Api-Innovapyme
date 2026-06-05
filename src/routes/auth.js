import { Router } from "express";
import accountExist from "../middlewares/accountExist.js";
import createHash from "../middlewares/createHash.js";
import generateToken from "../middlewares/generateToken.js";
import registerUser from "../controller/auth/registerUser.js";
import accountNotExist from "../middlewares/accountNotExist.js";
import compareHash from "../middlewares/compareHash.js";
import userStatus from "../middlewares/userStatus.js";
import loginUser from "../controller/auth/loginUser.js";
import verifyToken from "../middlewares/verifyToken.js";
import getUserProfile from "../controller/auth/getUserProfile.js";
import updateUserProfile from "../controller/auth/updateUserProfile.js";

const routerAuth = Router();

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     description: Crea una nueva cuenta de usuario y retorna un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - correo
 *               - contrasena
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: contraseña123
 *               telefono:
 *                 type: string
 *                 example: "3123456789"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
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
 *                   example: Usuario creado
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       409:
 *         description: Usuario ya existe
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
 *                   example: Correo duplicado
 */

routerAuth.post(
  "/registro",
  accountExist,
  createHash,
  generateToken,
  registerUser,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     description: Permite a un usuario existente iniciar sesión y retorna un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario logueado correctamente
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Credenciales inválidas
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
 *                   example: Credenciales inválidas
 *       403:
 *         description: Usuario no autorizado
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
 *                   example: Usuario no autorizado
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
 *                   example: Usuario no existe
 */

routerAuth.post(
  "/login",
  accountNotExist,
  compareHash,
  userStatus,
  generateToken,
  loginUser,
);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil de usuario
 *     description: Retorna el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario obtenido exitosamente
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
 *                   example: Perfil de usuario
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Pérez
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: juan.perez@example.com
 *                     telefono:
 *                       type: string
 *                       example: "3123456789"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *
 *       401:
 *         description: Token no proporcionado o inválido
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
 */
routerAuth.get("/perfil", verifyToken, getUserProfile);


routerAuth.put("/perfil", verifyToken, updateUserProfile);

export default routerAuth;
