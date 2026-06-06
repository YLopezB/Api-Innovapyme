import { readUser } from "../../repositories/user/readUser.js";

const getUserProfile = async (req, res, next) => {
  try {
    const { usuario } = req;
    const user = await readUser({ id: usuario.id });
    res.status(200).json({
      success: true,
      message: "Perfil de usuario",
      data: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono,
        estado: user.estado,
        fecha_creacion: user.fecha_creacion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getUserProfile;
