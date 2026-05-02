export function normalizeCreateBody(body) {
  const nombreRaw = body.nombre;
  const nombre = typeof nombreRaw === "string" ? nombreRaw.trim() : "";

  const descripcionRaw = body.descripcion;
  const descripcion =
    descripcionRaw === undefined || descripcionRaw === null
      ? null
      : String(descripcionRaw).trim() === ""
        ? null
        : String(descripcionRaw);

  const catRaw = body.categoria;
  const categoria =
    catRaw === undefined || catRaw === null
      ? null
      : String(catRaw).trim() === ""
        ? null
        : String(catRaw);

  return {
    nombre_producto: nombre,
    descripcion,
    cantidad: body.cantidad,
    precio_unitario: body.precio_unitario,
    categoria,
  };
}

/** @returns {string | null} mensaje de error o null si es válido */
export function validateCreate(payload) {
  if (!payload.nombre_producto) {
    return "El nombre es requerido";
  }
  const cantidad = Number(payload.cantidad);
  if (
    payload.cantidad === undefined ||
    payload.cantidad === null ||
    !Number.isInteger(cantidad) ||
    cantidad < 0
  ) {
    return "cantidad debe ser un entero mayor o igual a 0";
  }
  const precio = Number(payload.precio_unitario);
  if (
    payload.precio_unitario === undefined ||
    payload.precio_unitario === null ||
    Number.isNaN(precio) ||
    precio < 0
  ) {
    return "precio_unitario debe ser un número mayor o igual a 0";
  }
  return null;
}
