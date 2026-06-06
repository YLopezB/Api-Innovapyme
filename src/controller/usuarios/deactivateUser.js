import { Prisma } from "@prisma/client";
import { readUser } from "../../repositories/user/readUser.js";
import { updateUser } from "../../repositories/user/updateUser.js";

const ADMIN_ROLE_ID = 1;

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

    const existing = await readUser({ id });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No encontrado",
      });
    }

    if (existing.id_tipo_usuario === ADMIN_ROLE_ID) {
      return res.status(400).json({
        success: false,
        message: "No puedes desactivar un administrador",
      });
    }

    if (!existing.estado) {
      return res.status(200).json({
        success: true,
        message: "Desactivado",
        data: mapUsuarioSafe(existing),
      });
    }

    try {
      const updated = await updateUser({ id }, { estado: false });

      return res.status(200).json({
        success: true,
        message: "Desactivado",
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
