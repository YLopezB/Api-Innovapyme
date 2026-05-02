import findInventarioPaginated from "../../repositories/inventario/listInventario.js";

function mapProducto(row) {
  return {
    id: row.id,
    nombre: row.nombre_producto,
    descripcion: row.descripcion,
    cantidad: row.cantidad,
    precio_unitario: row.precio_unitario,
    categoria: row.categoria,
    fecha_registro: row.fecha_registro,
    fecha_actualizacion: row.fecha_actualizacion,
  };
}

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
