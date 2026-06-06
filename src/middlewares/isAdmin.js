import { readUser } from "../repositories/user/readUser.js";

export default async (req, res, next) => {
  try {
    const userId = req.usuario?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o usuario no autenticado",
      });
    }

    const user = await readUser({ id: userId });
    if (!user || user.id_tipo_usuario !== 1) {
      return res.status(403).json({
        success: false,
        message: "Sin permiso",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
