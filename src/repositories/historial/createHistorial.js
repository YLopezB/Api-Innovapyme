import prisma from "../../config/database.js";

export default async (data, txClient = prisma) => {
  return txClient.historial.create({ data });
};
