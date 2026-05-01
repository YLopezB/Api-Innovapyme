import { readUser } from "../repositories/user/readUser.js";

export default async (req, res, next) => {
  const { correo } = req.body;

  try {
    const usuraio = await readUser({ correo });

    if (!usuraio) {
      return res.status(404).json({
        success: false,
        message: "Usuario no existe",
      });
    }

    req.usuario = usuraio;

    next();
  } catch (error) {
    next(error);
  }
}