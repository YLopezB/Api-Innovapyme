import prisma from '../../config/database.js';

/**
 * Lista de correos de usuarios de prueba que se limpian antes de cada test.
 * Agregar aquí los correos que usen los tests para evitar conflictos.
 */
export const TEST_EMAILS = [
  'test.pu01@example.com',
];

/**
 * Elimina todos los usuarios de prueba de la base de datos.
 * Llamar en beforeEach o afterEach de los tests.
 */
export async function cleanTestUsers() {
  await prisma.usuario.deleteMany({
    where: {
      correo: { in: TEST_EMAILS },
    },
  });
}

/**
 * Cierra la conexión de Prisma al terminar la suite.
 * Llamar en afterAll.
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}
