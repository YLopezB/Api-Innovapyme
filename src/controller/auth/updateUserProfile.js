import { updateUser } from "../../repositories/user/updateUser.js";

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await updateUser({ id: req.usuario.id }, req.body);
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
  } catch (error) {
    next(error);
  }
};

export default updateUserProfile;
