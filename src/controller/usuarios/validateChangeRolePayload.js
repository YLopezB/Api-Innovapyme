const ALLOWED_FIELDS = ["id_tipo_usuario"];

export function normalizeChangeRoleBody(body) {
  if (body.id_tipo_usuario === undefined) {
    return {};
  }
  return { id_tipo_usuario: body.id_tipo_usuario };
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

/** @returns {string | null} */
export function validateChangeRole(payload) {
  if (payload.id_tipo_usuario === undefined) {
    return "id_tipo_usuario es requerido";
  }

  const idTipo = Number(payload.id_tipo_usuario);
  if (
    payload.id_tipo_usuario === null ||
    !Number.isInteger(idTipo) ||
    idTipo < 1
  ) {
    return "id_tipo_usuario debe ser un entero válido";
  }

  return null;
}
