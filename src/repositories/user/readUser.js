import prisma from "../../config/database.js";

export const readUser = async (data) => {
  const result = await prisma.usuario.findFirst({
    where: data,
  });
  return result;
};

export const readUsers = async (data) => {
  const result = await prisma.usuario.findMany({
    where: data,
  });
  return result;
};


