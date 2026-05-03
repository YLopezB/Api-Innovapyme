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

/** Campos parciales; claves alineadas a Prisma (nombre → nombre_producto). */
export function normalizeUpdateBody(body) {
  const out = {};

  if (body.nombre !== undefined) {
    const nombre =
      typeof body.nombre === "string" ? body.nombre.trim() : "";
    out.nombre_producto = nombre;
  }

  if (body.descripcion !== undefined) {
    if (body.descripcion === null) {
      out.descripcion = null;
    } else {
      const s = String(body.descripcion).trim();
      out.descripcion = s === "" ? null : s;
    }
  }

  if (body.cantidad !== undefined) {
    out.cantidad = body.cantidad;
  }

  if (body.precio_unitario !== undefined) {
    out.precio_unitario = body.precio_unitario;
  }

  if (body.categoria !== undefined) {
    if (body.categoria === null) {
      out.categoria = null;
    } else {
      const s = String(body.categoria).trim();
      out.categoria = s === "" ? null : s;
    }
  }

  return out;
}

/** @returns {string | null} */
export function validateUpdate(updateData) {
  if (updateData.nombre_producto !== undefined) {
    if (!updateData.nombre_producto) {
      return "El nombre no puede estar vacío";
    }
  }
  if (updateData.cantidad !== undefined) {
    if (updateData.cantidad === null) {
      return "cantidad debe ser un entero mayor o igual a 0";
    }
    const cantidad = Number(updateData.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return "cantidad debe ser un entero mayor o igual a 0";
    }
  }
  if (updateData.precio_unitario !== undefined) {
    if (updateData.precio_unitario === null) {
      return "precio_unitario debe ser un número mayor o igual a 0";
    }
    const precio = Number(updateData.precio_unitario);
    if (Number.isNaN(precio) || precio < 0) {
      return "precio_unitario debe ser un número mayor o igual a 0";
    }
  }
  return null;
}
