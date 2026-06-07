import { Router } from "express";
import routerAuth from "./auth.js";
import routerInventario from "./inventario.js";
import routerUsuarios from "./usuarios.js";
import routerVentas from "./ventas.js";

const routerIndex = Router();

// Rutas específicas
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Ruta para inicio de sesión, registro de usuarios, actualizar usuario y obtener información del usuario.
 */

routerIndex.use('/auth', routerAuth);
routerIndex.use('/inventario', routerInventario);
routerIndex.use('/usuarios', routerUsuarios);
routerIndex.use('/ventas', routerVentas);

export default routerIndex;