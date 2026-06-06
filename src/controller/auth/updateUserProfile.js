import { Prisma } from "@prisma/client";
import { updateUser } from "../../repositories/user/updateUser.js";
import {
  normalizeUpdateBody,
  validateUnknownFields,
  validateUpdate,
} from "./validateProfilePayload.js";

const updateUserProfile = async (req, res, next) => {
  try {
    const unknownErr = validateUnknownFields(req.body);
    if (unknownErr) {
      return res.status(400).json({
        success: false,
        message: unknownErr,
      });
    }

    const updateData = normalizeUpdateBody(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
      });
    }

    const errMsg = validateUpdate(updateData);
    if (errMsg) {
      return res.status(400).json({
        success: false,
        message: errMsg,
      });
    }

    try {
      const result = await updateUser({ id: req.usuario.id }, updateData);
      return res.status(200).json({
        success: true,
        message: "Actualizado",
        data: {
          id: result.id,
          nombre: result.nombre,
          apellido: result.apellido,
          correo: result.correo,
          telefono: result.telefono,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        return res.status(400).json({
          success: false,
          message: "El correo ya está registrado",
        });
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

export default updateUserProfile;
