import { Prisma } from "@prisma/client";
import readInventarioById from "../../repositories/inventario/readInventarioById.js";
import updateInventarioRepo from "../../repositories/inventario/updateInventario.js";
import {
  normalizeUpdateBody,
  validateUpdate,
} from "./validateProductoPayload.js";
import { mapProducto } from "./mapProducto.js";

export default async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    const existing = await readInventarioById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    const updateData = normalizeUpdateBody(req.body);
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
      });
    }

    const errMsg = validateUpdate(updateData);
    if (errMsg) {
      return res.status(400).json({
        success: false,
        message: errMsg,
      });
    }

    if (updateData.cantidad !== undefined) {
      updateData.cantidad = Number(updateData.cantidad);
    }
    if (updateData.precio_unitario !== undefined) {
      updateData.precio_unitario = Number(updateData.precio_unitario);
    }

    try {
      const updated = await updateInventarioRepo(id, updateData);
      return res.status(200).json({
        success: true,
        message: "Actualizado",
        data: mapProducto(updated),
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          message: "No encontrado",
        });
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};
