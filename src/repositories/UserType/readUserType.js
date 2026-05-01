import prisma from "../../config/database.js";

export const readUserType = async (data) => {
  const result = await prisma.tipo_usuario.findFirst({
    where: data,
  });
  return result;
};

export const readUserTypes = async (data) => {
  const result = await prisma.tipo_usuario.findMany({
    where: data,
  });
  return result;
};
