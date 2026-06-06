import { Prisma } from "@prisma/client";
import { readUser } from "../../repositories/user/readUser.js";
import { updateUser } from "../../repositories/user/updateUser.js";
import { readUserType } from "../../repositories/UserType/readUserType.js";
import {
  normalizeChangeRoleBody,
  validateChangeRole,
  validateUnknownFields,
} from "./validateChangeRolePayload.js";

function mapUsuarioSafe(user) {
  const { contrasena, ...safe } = user;
  return safe;
}

export default async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    const unknownErr = validateUnknownFields(req.body);
    if (unknownErr) {
      return res.status(400).json({
        success: false,
        message: unknownErr,
      });
    }

    const payload = normalizeChangeRoleBody(req.body);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
      });
    }

    const errMsg = validateChangeRole(payload);
    if (errMsg) {
      return res.status(400).json({
        success: false,
        message: errMsg,
      });
    }

    const existing = await readUser({ id });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    const idTipoUsuario = Number(payload.id_tipo_usuario);
    const role = await readUserType({ id: idTipoUsuario });
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "id_tipo_usuario no existe",
      });
    }

    try {
      const updated = await updateUser(
        { id },
        { id_tipo_usuario: idTipoUsuario },
      );

      return res.status(200).json({
        success: true,
        message: "Actualizado",
        data: mapUsuarioSafe(updated),
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          message: "No encontrado",
        });
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};
