import { Router } from "express";
import routerAuth from "./auth.js";

const routerIndex = Router();

// Rutas específicas
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Ruta para inicio de sesión, registro de usuarios, actualizar usuario y obtener información del usuario.
 */

routerIndex.use('/auth', routerAuth)


export default routerIndex;