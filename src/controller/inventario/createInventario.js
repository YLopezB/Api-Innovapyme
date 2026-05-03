import { Prisma } from "@prisma/client";
import createInventarioProduct from "../../repositories/inventario/createInventarioProduct.js";
import {
  normalizeCreateBody,
  validateCreate,
} from "./validateProductoPayload.js";
import { mapProducto } from "./mapProducto.js";

export default async (req, res, next) => {
  try {
    const idUsuarioRaw = req.usuario?.id;
    const idUsuario = Number(idUsuarioRaw);
    if (!idUsuario || Number.isNaN(idUsuario) || idUsuario < 1) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o usuario no autenticado",
      });
    }

    const payload = normalizeCreateBody(req.body);
    const errMsg = validateCreate(payload);
    if (errMsg) {
      return res.status(400).json({
        success: false,
        message: errMsg,
      });
    }

    try {
      const inventario = await createInventarioProduct({
        id_usuario: idUsuario,
        productoPayload: {
          nombre_producto: payload.nombre_producto,
          descripcion: payload.descripcion,
          cantidad: Number(payload.cantidad),
          precio_unitario: Number(payload.precio_unitario),
          categoria: payload.categoria,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Producto creado",
        data: mapProducto(inventario),
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      ) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos: id_usuario no existe",
        });
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};
