import prisma from "../../config/database.js";

export const updateUser = async (id, data) => {
   const result = await prisma.usuario.update({
        where: id,
        data,
   })
   return result;
}
