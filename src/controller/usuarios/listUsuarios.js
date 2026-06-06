import { readUsers } from "../../repositories/user/readUser.js";

export default async (req, res, next) => {
  try {
    const users = await readUsers();
    // Excluir contraseñas por seguridad
    const safeUsers = users.map(({ contrasena, ...user }) => user);

    return res.status(200).json({
      success: true,
      data: safeUsers,
    });
  } catch (error) {
    next(error);
  }
};
