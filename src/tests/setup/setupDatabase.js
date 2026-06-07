import prisma from '../../config/database.js';

/**
 * Correos de prueba automatizados: deben coincidir con uno de estos prefijos
 * y usar dominio @example.com (o agregar el correo a TEST_EMAIL_EXACT).
 *
 * No uses @example.com para datos manuales en desarrollo.
 */
export const TEST_EMAIL_SUFFIX = '@example.com';

export const TEST_EMAIL_PREFIXES = ['test.', 'admin.pu', 'user.pu', 'user.ventas', 'cliente.ventas', 'user.listar.ventas', 'cliente.listar.ventas', 'user.obtener.venta', 'cliente.obtener.venta'];

export const TEST_EMAIL_EXACT = [];

export function isTestEmail(correo) {
  if (typeof correo !== 'string' || !correo.endsWith(TEST_EMAIL_SUFFIX)) {
    return false;
  }
  if (TEST_EMAIL_EXACT.includes(correo)) {
    return true;
  }
  return TEST_EMAIL_PREFIXES.some((prefix) => correo.startsWith(prefix));
}

function buildTestUserWhere() {
  return {
    OR: [
      ...TEST_EMAIL_PREFIXES.map((prefix) => ({
        correo: { startsWith: prefix, endsWith: TEST_EMAIL_SUFFIX },
      })),
      ...(TEST_EMAIL_EXACT.length > 0
        ? [{ correo: { in: TEST_EMAIL_EXACT } }]
        : []),
    ],
  };
}

async function deleteUsersAndRelations(userIds) {
  if (userIds.length === 0) {
    return;
  }

  const inventarios = await prisma.inventario.findMany({
    where: { id_usuario: { in: userIds } },
    select: { id: true },
  });
  const inventarioIds = inventarios.map((i) => i.id);

  const ventaWhere =
    inventarioIds.length > 0
      ? {
          OR: [
            { id_usuario: { in: userIds } },
            { id_inventario: { in: inventarioIds } },
          ],
        }
      : { id_usuario: { in: userIds } };

  await prisma.$transaction([
    prisma.venta.deleteMany({ where: ventaWhere }),
    prisma.historial.deleteMany({ where: { id_usuario: { in: userIds } } }),
    prisma.inventario.deleteMany({ where: { id_usuario: { in: userIds } } }),
    prisma.usuario.deleteMany({ where: { id: { in: userIds } } }),
  ]);
}

/**
 * Elimina solo usuarios de prueba automatizados y sus datos relacionados.
 */
export async function cleanAllTestData() {
  const testUsers = await prisma.usuario.findMany({
    where: buildTestUserWhere(),
    select: { id: true },
  });

  await deleteUsersAndRelations(testUsers.map((u) => u.id));
}

/**
 * Limpia correos concretos si son correos de prueba válidos.
 */
export async function cleanTestUsersByEmails(correos) {
  const emails = correos.filter(isTestEmail);
  if (emails.length === 0) {
    return;
  }

  const testUsers = await prisma.usuario.findMany({
    where: { correo: { in: emails } },
    select: { id: true },
  });

  await deleteUsersAndRelations(testUsers.map((u) => u.id));
}

/** @deprecated Usar cleanAllTestData */
export async function cleanTestUsers() {
  await cleanAllTestData();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
