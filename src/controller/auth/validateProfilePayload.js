const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_FIELDS = ["nombre", "apellido", "correo", "telefono"];

/** Campos parciales permitidos para actualizar perfil. */
export function normalizeUpdateBody(body) {
  const out = {};

  if (body.nombre !== undefined) {
    out.nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
  }

  if (body.apellido !== undefined) {
    out.apellido = typeof body.apellido === "string" ? body.apellido.trim() : "";
  }

  if (body.correo !== undefined) {
    out.correo = typeof body.correo === "string" ? body.correo.trim() : "";
  }

  if (body.telefono !== undefined) {
    if (body.telefono === null) {
      out.telefono = null;
    } else {
      const telefono = String(body.telefono).trim();
      out.telefono = telefono === "" ? null : telefono;
    }
  }

  return out;
}

/** @returns {string | null} */
export function validateUnknownFields(rawBody) {
  const unknownFields = Object.keys(rawBody ?? {}).filter(
    (key) => !ALLOWED_FIELDS.includes(key),
  );
  if (unknownFields.length > 0) {
    return `Campo(s) no permitido(s): ${unknownFields.join(", ")}`;
  }
  return null;
}

/** @returns {string | null} mensaje de error o null si es válido */
export function validateUpdate(updateData) {

  if (updateData.nombre !== undefined) {
    if (typeof updateData.nombre !== "string" || !updateData.nombre) {
      return "El nombre no puede estar vacío";
    }
  }

  if (updateData.apellido !== undefined) {
    if (typeof updateData.apellido !== "string" || !updateData.apellido) {
      return "El apellido no puede estar vacío";
    }
  }

  if (updateData.correo !== undefined) {
    if (typeof updateData.correo !== "string" || !updateData.correo) {
      return "El correo no puede estar vacío";
    }
    if (!EMAIL_REGEX.test(updateData.correo)) {
      return "El correo no tiene un formato válido";
    }
  }

  if (updateData.telefono !== undefined && updateData.telefono !== null) {
    if (typeof updateData.telefono !== "string" || !updateData.telefono) {
      return "El teléfono no puede estar vacío";
    }
  }

  return null;
}
