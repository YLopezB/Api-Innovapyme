import { updateUser } from "../../repositories/user/updateUser.js";

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await updateUser({ id: req.usuario.id }, req.body);
    console.log(result);
    return res.status(200).json({
      success: true,
      message: "Actualizado",
    });
  } catch (error) {
    next(error);
  }
};

export default updateUserProfile;
