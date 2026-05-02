import prisma from "../../config/database.js";

export default async (id) => {
  return prisma.inventario.findUnique({
    where: { id },
  });
};
