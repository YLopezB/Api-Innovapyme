import { createManyUsersTypes } from "../../repositories/UserType/createUserType.js";

const userTypes = [
  { nombre: "Administrador" },
  { nombre: "Cliente" },
  { nombre: "Visitante" },
];

createManyUsersTypes(userTypes);

console.log("Tipos de usuario creados exitosamente");

process.exit(1)
