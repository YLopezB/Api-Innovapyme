import prisma from "../../config/database.js";

export const createUserType = async (tipoUsuario) => {
  const result = await prisma.tipo_usuario.create({
    data: tipoUsuario,
    skipDuplicates: true,
  });
  return result;
};

export const createManyUsersTypes = async (tiposUsuarios) => {
  const result = await prisma.tipo_usuario.createMany({
    data: tiposUsuarios,
    skipDuplicates: true,
  });
  return result;
};
