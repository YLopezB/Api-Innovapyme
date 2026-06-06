import prisma from "../../config/database.js";

export default async (stock) => {
  return prisma.inventario.findMany({
    where: {
      cantidad: {
        lte: stock
      }
    }
  });
};