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
  correo: 'user.obtener.venta@example.com',
  contrasena: 'UserPass123!',
};

const CLIENTE_TEST = {
  nombre: 'Cliente',
  apellido: 'Test',
  correo: 'cliente.obtener.venta@example.com',
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

  const producto = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto Test',
      descripcion: 'Descripción del producto',
      cantidad: 10,
      precio_unitario: 10.50,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  const venta = await prisma.venta.create({
    data: {
      id_usuario: cliente.id,
      id_inventario: producto.id,
      cantidad: 2,
      precio_unitario: 10.50,
      total: 21.00,
    },
  });

  return { usuario, cliente, producto, venta };
}

describe.sequential('PU-03 | Ventas - Obtener venta por ID', () => {
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

  it('debe denegar el acceso a GET /api/ventas/:id si no hay token (401)', async () => {
    const response = await request(app).get('/api/ventas/1');
    expect(response.status).toBe(401);
  });

  it('debe retornar venta existente (200)', async () => {
    const { venta } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get(`/api/ventas/${venta.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(venta.id);
    expect(response.body.data.clienteId).toBe(venta.id_usuario);
    expect(response.body.data.productoId).toBe(venta.id_inventario);
    expect(response.body.data.cantidad).toBe(venta.cantidad);
    expect(response.body.data.precioUnitario).toBe(venta.precio_unitario);
    expect(response.body.data.total).toBe(venta.total);
    expect(response.body.data.fechaVenta).toBeDefined();
    expect(response.body.data.producto).toBeDefined();
  });

  it('debe retornar 404 para venta inexistente', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe retornar 404 para ID inválido (no número)', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/ventas/abc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe incluir información completa del producto', async () => {
    const { venta } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get(`/api/ventas/${venta.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.producto).toBeDefined();
    expect(response.body.data.producto).toHaveProperty('id');
    expect(response.body.data.producto).toHaveProperty('nombre');
    expect(response.body.data.producto).toHaveProperty('descripcion');
    expect(response.body.data.producto).toHaveProperty('categoria');
  });
});
