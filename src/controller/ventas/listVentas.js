import listVentas from "../../repositories/ventas/listVentas.js";
import { mapVenta } from "./mapVenta.js";

export default async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query.limit), 10) || 10),
    );

    const { data, meta } = await listVentas({ page, limit });

    return res.status(200).json({
      success: true,
      data: data.map(mapVenta),
      meta,
    });
  } catch (error) {
    next(error);
  }
};
