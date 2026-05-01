import bcryptjs from "bcryptjs";

export default async (req, res, next) => {
  try {
    const passwordBody = req.body.contrasena;
    const passwordUser = req.usuario.contrasena;
    const compare = bcryptjs.compareSync(passwordBody, passwordUser);

    if (compare) {
      return next();
    }
    return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
    });
  } catch (error) {
    next(error);
  }
};
