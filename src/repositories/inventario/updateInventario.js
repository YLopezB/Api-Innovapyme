import prisma from "../../config/database.js";

export default async (id, data) => {
  return prisma.inventario.update({
    where: { id },
    data,
  });
};
