import { createManyUsersTypes } from "../../repositories/UserType/createUserType.js";
import { readUserTypes } from "../../repositories/UserType/readUserType.js";
import prisma from "../database.js";

const userTypes = [
  { nombre: "Administrador",
    descripcion: "Usuario con permisos de administrador"
   },
  { nombre: "Cliente",
    descripcion: "Usuario con permisos de cliente"
   },
  { nombre: "Visitante",
    descripcion: "Usuario con permisos de visitante"
   },
];

try {
  const existingUserTypes = await readUserTypes({
    nombre: { in: userTypes.map((type) => type.nombre) },
  });

  const existingNames = new Set(existingUserTypes.map((type) => type.nombre));
  const missingUserTypes = userTypes.filter(
    (type) => !existingNames.has(type.nombre)
  );

  if (missingUserTypes.length > 0) {
    await createManyUsersTypes(missingUserTypes);
  }

  console.log(
    `Seed de tipos de usuario completado. Creados: ${missingUserTypes.length}, ya existentes: ${userTypes.length - missingUserTypes.length}`
  );
} catch (error) {
  console.error("Error ejecutando seed de tipos de usuario:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
