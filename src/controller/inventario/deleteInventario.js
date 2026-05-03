import readInventarioById from "../../repositories/inventario/readInventarioById.js";
import deleteInventarioById, {
  countVentasByInventarioId,
} from "../../repositories/inventario/deleteInventario.js";

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

    const ventas = await countVentasByInventarioId(id);
    if (ventas > 0) {
      return res.status(400).json({
        success: false,
        message: "Tiene ventas",
      });
    }

    await deleteInventarioById(id);

    return res.status(200).json({
      success: true,
      message: "Eliminado",
    });
  } catch (error) {
    next(error);
  }
};
