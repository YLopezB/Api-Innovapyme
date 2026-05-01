import prisma from "../../config/database.js";

export default async (usuario) => {
  const result = await prisma.usuario.create({
    data: usuario,
    skipDuplicates: true,
  });
  return result;
};
