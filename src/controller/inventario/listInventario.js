import findInventarioPaginated from "../../repositories/inventario/listInventario.js";
import { mapProducto } from "./mapProducto.js";

export default async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query.limit), 10) || 10),
    );

    const { data, meta } = await findInventarioPaginated({ page, limit });

    return res.status(200).json({
      success: true,
      data: data.map(mapProducto),
      meta,
    });
  } catch (error) {
    next(error);
  }
};
