export function mapProducto(row) {
  if (!row) return null;
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
