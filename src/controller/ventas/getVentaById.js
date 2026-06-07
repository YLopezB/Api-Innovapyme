import readVentaById from "../../repositories/ventas/readVentaById.js";
import { mapVenta } from "./mapVenta.js";

export default async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    const row = await readVentaById(id);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapVenta(row),
    });
  } catch (error) {
    next(error);
  }
};
