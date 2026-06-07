export function normalizeCreateBody(body) {
  const clienteIdRaw = body.clienteId;
  const clienteId = Number(clienteIdRaw);

  const productosRaw = body.productos;
  const productos = Array.isArray(productosRaw) ? productosRaw : [];

  const totalRaw = body.total;
  const total = Number(totalRaw);

  return {
    clienteId,
    productos: productos.map((p) => ({
      productoId: Number(p.productoId),
      cantidad: Number(p.cantidad),
      precioUnitario: Number(p.precioUnitario),
    })),
    total,
  };
}

export function validateCreate(payload) {
  if (!Number.isInteger(payload.clienteId) || payload.clienteId <= 0) {
    return "clienteId debe ser un entero positivo";
  }

  if (!Array.isArray(payload.productos) || payload.productos.length === 0) {
    return "productos debe ser un array no vacío";
  }

  for (let i = 0; i < payload.productos.length; i++) {
    const p = payload.productos[i];
    if (!Number.isInteger(p.productoId) || p.productoId <= 0) {
      return `productos[${i}].productoId debe ser un entero positivo`;
    }
    if (!Number.isInteger(p.cantidad) || p.cantidad <= 0) {
      return `productos[${i}].cantidad debe ser un entero positivo`;
    }
    if (Number.isNaN(p.precioUnitario) || p.precioUnitario < 0) {
      return `productos[${i}].precioUnitario debe ser un número mayor o igual a 0`;
    }
  }

  if (Number.isNaN(payload.total) || payload.total < 0) {
    return "total debe ser un número mayor o igual a 0";
  }

  return null;
}
