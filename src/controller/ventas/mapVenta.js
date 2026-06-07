export function mapVenta(row) {
  return {
    id: row.id,
    clienteId: row.id_usuario,
    productoId: row.id_inventario,
    cantidad: row.cantidad,
    precioUnitario: row.precio_unitario,
    total: row.total,
    fechaVenta: row.fecha_venta,
    producto: row.inventario
      ? {
          id: row.inventario.id,
          nombre: row.inventario.nombre_producto,
          descripcion: row.inventario.descripcion,
          categoria: row.inventario.categoria,
        }
      : null,
  };
}
