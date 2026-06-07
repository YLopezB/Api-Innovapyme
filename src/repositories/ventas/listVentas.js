import prisma from "../../config/database.js";

export default async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.venta.findMany({
      skip,
      take: limit,
      orderBy: {
        fecha_venta: "desc",
      },
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
    }),
    prisma.venta.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      total_pages: totalPages,
    },
  };
};
