import { createManyUsersTypes } from "../../repositories/UserType/createUserType.js";

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

await createManyUsersTypes(userTypes);

console.log("Tipos de usuario creados exitosamente");

process.exit(0)
