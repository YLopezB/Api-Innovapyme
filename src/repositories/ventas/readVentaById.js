import prisma from "../../config/database.js";

export default async (id) => {
  return prisma.venta.findUnique({
    where: { id },
    include: {
      inventario: true,
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          correo: true,
        },
      },
    },
  });
};
