import prisma from "../../config/database.js";

/** @returns {{ data: object[], meta: { total: number, page: number, limit: number, total_pages: number } }} */
export default async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.inventario.findMany({
      orderBy: { id: "asc" },
      skip,
      take: limit,
    }),
    prisma.inventario.count(),
  ]);

  const totalPages = Math.ceil(total / limit) || 0;

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
