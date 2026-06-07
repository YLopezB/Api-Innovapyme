import createVenta from "../../repositories/ventas/createVenta.js";
import { normalizeCreateBody, validateCreate } from "./validateVentaPayload.js";
import { mapVenta } from "./mapVenta.js";
import prisma from "../../config/database.js";

export default async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id;
    const payload = normalizeCreateBody(req.body);

    const validationError = validateCreate(payload);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const cliente = await prisma.usuario.findUnique({
      where: { id: payload.clienteId },
    });

    if (!cliente) {
      return res.status(400).json({
        success: false,
        message: "El clienteId no existe",
      });
    }

    for (const producto of payload.productos) {
      const inventario = await prisma.inventario.findUnique({
        where: { id: producto.productoId },
      });

      if (!inventario) {
        return res.status(400).json({
          success: false,
          message: `El producto con ID ${producto.productoId} no existe`,
        });
      }

      if (inventario.cantidad < producto.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto con ID: ${producto.productoId}. Stock disponible: ${inventario.cantidad}, solicitado: ${producto.cantidad}`,
          errorCode: "INSUFFICIENT_STOCK",
        });
      }
    }

    const ventas = await createVenta({
      id_usuario: payload.clienteId,
      productos: payload.productos,
    });

    return res.status(201).json({
      success: true,
      message: "Venta creada",
      data: ventas.map(mapVenta),
    });
  } catch (error) {
    next(error);
  }
};
