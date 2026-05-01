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
    console.log(req.usuario);
    req.usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.correo,
      contrasena: req.body.contrasena,
      telefono: req.body.telefono,
      id_tipo_usuario: req.body.id_tipo_usuario
    };
    
    next();
  } catch (error) {
    next(error);
  }
};
