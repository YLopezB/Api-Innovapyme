import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';
import {
  loginTestUser,
  registerTestUser,
} from '../helpers/testAuth.js';
import { cleanTestUsersByEmails } from '../setup/setupDatabase.js';

const USER_TEST = {
  nombre: 'User',
  apellido: 'Test',
  correo: 'user.listar.inventario@example.com',
  contrasena: 'UserPass123!',
};

async function getAuthToken(user) {
  let usuario = await prisma.usuario.findUnique({
    where: { correo: user.correo },
  });

  if (!usuario) {
    await registerTestUser(app, user);
  }

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      correo: user.correo,
      contrasena: user.contrasena,
    });
  return loginResponse.body.token;
}

async function setupTestData() {
  let usuario = await prisma.usuario.findUnique({
    where: { correo: USER_TEST.correo },
  });

  if (!usuario) {
    await registerTestUser(app, USER_TEST);
    usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
    });
  }

  const producto1 = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto 1',
      descripcion: 'Descripción del producto 1',
      cantidad: 10,
      precio_unitario: 100.00,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  const producto2 = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto 2',
      descripcion: 'Descripción del producto 2',
      cantidad: 20,
      precio_unitario: 200.00,
      categoria: 'Categoria 2',
      id_usuario: usuario.id,
    },
  });

  return { usuario, producto1, producto2 };
}

describe.sequential('PU-01 | Inventario - Listar inventario', () => {
  beforeAll(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
      select: { id: true },
    });

    if (usuario) {
      await prisma.inventario.deleteMany({
        where: {
          id_usuario: usuario.id,
        },
      });
      await prisma.historial.deleteMany({
        where: {
          id_usuario: usuario.id,
        },
      });
    }
    await cleanTestUsersByEmails([USER_TEST.correo]);
  });

  afterEach(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
      select: { id: true },
    });

    if (usuario) {
      await prisma.inventario.deleteMany({
        where: {
          id_usuario: usuario.id,
        },
      });
      await prisma.historial.deleteMany({
        where: {
          id_usuario: usuario.id,
        },
      });
    }
    await cleanTestUsersByEmails([USER_TEST.correo]);
  });

  it('debe denegar el acceso a GET /api/inventario si no hay token (401)', async () => {
    const response = await request(app).get('/api/inventario');
    expect(response.status).toBe(401);
  });

  it('debe listar inventario paginado (200)', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);
  });

  it('debe respetar parámetros de paginación (200)', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(5);
  });

  it('debe retornar array vacío si no hay productos', async () => {
    await prisma.inventario.deleteMany();
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.meta.total).toBe(0);
  });
});
