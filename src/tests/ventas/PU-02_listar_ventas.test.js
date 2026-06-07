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
  correo: 'user.listar.ventas@example.com',
  contrasena: 'UserPass123!',
};

const CLIENTE_TEST = {
  nombre: 'Cliente',
  apellido: 'Test',
  correo: 'cliente.listar.ventas@example.com',
  contrasena: 'ClientePass123!',
};

async function getAuthToken(credentials) {
  const res = await loginTestUser(
    app,
    credentials.correo,
    credentials.contrasena,
  );
  return res.body.token;
}

async function setupTestData() {
  await registerTestUser(app, USER_TEST);
  await registerTestUser(app, CLIENTE_TEST);

  const usuario = await prisma.usuario.findUnique({
    where: { correo: USER_TEST.correo },
  });

  const cliente = await prisma.usuario.findUnique({
    where: { correo: CLIENTE_TEST.correo },
  });

  const producto1 = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto Test 1',
      descripcion: 'Descripción del producto 1',
      cantidad: 10,
      precio_unitario: 10.50,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  const producto2 = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto Test 2',
      descripcion: 'Descripción del producto 2',
      cantidad: 5,
      precio_unitario: 25.00,
      categoria: 'Categoria 2',
      id_usuario: usuario.id,
    },
  });

  await prisma.venta.create({
    data: {
      id_usuario: cliente.id,
      id_inventario: producto1.id,
      cantidad: 2,
      precio_unitario: 10.50,
      total: 21.00,
    },
  });

  await prisma.venta.create({
    data: {
      id_usuario: cliente.id,
      id_inventario: producto2.id,
      cantidad: 1,
      precio_unitario: 25.00,
      total: 25.00,
    },
  });

  return { usuario, cliente, producto1, producto2 };
}

describe.sequential('PU-02 | Ventas - Listar ventas', () => {
  beforeAll(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
      select: { id: true },
    });
    const cliente = await prisma.usuario.findUnique({
      where: { correo: CLIENTE_TEST.correo },
      select: { id: true },
    });

    if (usuario || cliente) {
      const userIds = [];
      if (usuario) userIds.push(usuario.id);
      if (cliente) userIds.push(cliente.id);

      await prisma.venta.deleteMany({
        where: {
          id_usuario: { in: userIds },
        },
      });
      await prisma.inventario.deleteMany({
        where: {
          id_usuario: { in: userIds },
        },
      });
      await prisma.historial.deleteMany({
        where: {
          id_usuario: { in: userIds },
        },
      });
    }
    await cleanTestUsersByEmails([USER_TEST.correo, CLIENTE_TEST.correo]);
  });

  afterEach(async () => {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
      select: { id: true },
    });
    const cliente = await prisma.usuario.findUnique({
      where: { correo: CLIENTE_TEST.correo },
      select: { id: true },
    });

    if (usuario || cliente) {
      const userIds = [];
      if (usuario) userIds.push(usuario.id);
      if (cliente) userIds.push(cliente.id);

      await prisma.venta.deleteMany({
        where: {
          id_usuario: { in: userIds },
        },
      });
      await prisma.inventario.deleteMany({
        where: {
          id_usuario: { in: userIds },
        },
      });
    }
    await cleanTestUsersByEmails([USER_TEST.correo, CLIENTE_TEST.correo]);
  });

  it('debe denegar el acceso a GET /api/ventas si no hay token (401)', async () => {
    const response = await request(app).get('/api/ventas');
    expect(response.status).toBe(401);
  });

  it('debe listar ventas paginadas (200)', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.total).toBeGreaterThan(0);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);
    expect(response.body.meta.total_pages).toBeGreaterThan(0);
  });

  it('debe respetar parámetros de paginación - page', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(5);
  });

  it('debe respetar parámetros de paginación - limit', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas?page=1&limit=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.meta.limit).toBe(1);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it('debe incluir información del producto en la respuesta', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    if (response.body.data.length > 0) {
      expect(response.body.data[0].producto).toBeDefined();
      expect(response.body.data[0].producto).toHaveProperty('id');
      expect(response.body.data[0].producto).toHaveProperty('nombre');
    }
  });

  it('debe retornar array vacío si no hay ventas', async () => {
    await prisma.venta.deleteMany();
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.meta.total).toBe(0);
  });
});
