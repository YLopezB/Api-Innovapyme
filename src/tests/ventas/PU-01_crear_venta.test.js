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
  correo: 'user.ventas@example.com',
  contrasena: 'UserPass123!',
};

const CLIENTE_TEST = {
  nombre: 'Cliente',
  apellido: 'Test',
  correo: 'cliente.ventas@example.com',
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

  return { usuario, cliente, producto1, producto2 };
}

describe.sequential('PU-01 | Ventas - Crear venta', () => {
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

  it('debe denegar el acceso a POST /api/ventas si no hay token (401)', async () => {
    const response = await request(app).post('/api/ventas');
    expect(response.status).toBe(401);
  });

  it('debe crear venta exitosamente con stock suficiente (201)', async () => {
    const { cliente, producto1, producto2 } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      clienteId: cliente.id,
      productos: [
        { productoId: producto1.id, cantidad: 2, precioUnitario: 10.50 },
        { productoId: producto2.id, cantidad: 1, precioUnitario: 25.00 },
      ],
      total: 46.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Venta creada');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);

    const updatedProducto1 = await prisma.inventario.findUnique({
      where: { id: producto1.id },
    });
    const updatedProducto2 = await prisma.inventario.findUnique({
      where: { id: producto2.id },
    });

    expect(updatedProducto1.cantidad).toBe(8);
    expect(updatedProducto2.cantidad).toBe(4);
  });

  it('debe rechazar venta con stock insuficiente (400)', async () => {
    const { cliente, producto1 } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      clienteId: cliente.id,
      productos: [
        { productoId: producto1.id, cantidad: 20, precioUnitario: 10.50 },
      ],
      total: 210.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('INSUFFICIENT_STOCK');
    expect(response.body.message).toContain('Stock insuficiente');
  });

  it('debe validar datos inválidos - clienteId requerido (400)', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const payload = {
      productos: [
        { productoId: 1, cantidad: 2, precioUnitario: 10.50 },
      ],
      total: 21.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe validar datos inválidos - productos requeridos (400)', async () => {
    const { cliente } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      clienteId: cliente.id,
      productos: [],
      total: 0,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe rechazar venta con producto inexistente (400)', async () => {
    const { cliente } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      clienteId: cliente.id,
      productos: [
        { productoId: 99999, cantidad: 2, precioUnitario: 10.50 },
      ],
      total: 21.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('no existe');
  });

  it('debe rechazar venta con cliente inexistente (400)', async () => {
    const { producto1 } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      clienteId: 99999,
      productos: [
        { productoId: producto1.id, cantidad: 2, precioUnitario: 10.50 },
      ],
      total: 21.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('no existe');
  });

  it('debe ser transaccional - si falla un producto, no se crea nada', async () => {
    const { cliente, producto1, producto2 } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const initialStock1 = await prisma.inventario.findUnique({
      where: { id: producto1.id },
    });
    const initialStock2 = await prisma.inventario.findUnique({
      where: { id: producto2.id },
    });

    const payload = {
      clienteId: cliente.id,
      productos: [
        { productoId: producto1.id, cantidad: 2, precioUnitario: 10.50 },
        { productoId: 99999, cantidad: 1, precioUnitario: 25.00 },
      ],
      total: 46.00,
    };

    const response = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);

    const finalStock1 = await prisma.inventario.findUnique({
      where: { id: producto1.id },
    });
    const finalStock2 = await prisma.inventario.findUnique({
      where: { id: producto2.id },
    });

    expect(finalStock1.cantidad).toBe(initialStock1.cantidad);
    expect(finalStock2.cantidad).toBe(initialStock2.cantidad);
  });
});
