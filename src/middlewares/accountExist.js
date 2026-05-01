import { readUser } from "../repositories/user/readUser.js";

export default async (req, res, next) => {
  const { correo } = req.body;

  try {
    const usuraio = await readUser({ correo });

    if (usuraio) {
      return res.status(409).json({
        success: false,
        message: "Correo duplicado",
      });
    }

    req.usuario = req.body;

    next();
  } catch (error) {
    next(error);
  }
};
