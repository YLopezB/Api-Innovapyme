import prisma from "../../config/database.js";

export async function countVentasByInventarioId(id_inventario) {
  return prisma.venta.count({
    where: { id_inventario },
  });
}

export default async (id) => {
  return prisma.inventario.delete({
    where: { id },
  });
};
