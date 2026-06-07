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
  correo: 'user.crear.inventario@example.com',
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

describe.sequential('PU-03 | Inventario - Crear inventario', () => {
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

  it('debe denegar el acceso a POST /api/inventario si no hay token (401)', async () => {
    const response = await request(app).post('/api/inventario');
    expect(response.status).toBe(401);
  });

  it('debe crear producto exitosamente (201)', async () => {
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Nuevo',
      descripcion: 'Descripción del producto',
      cantidad: 10,
      precio_unitario: 100.00,
      categoria: 'Categoria 1',
    };

    const response = await request(app)
      .post('/api/inventario')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Producto creado');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.nombre).toBe(payload.nombre);
    expect(response.body.data.descripcion).toBe(payload.descripcion);
    expect(response.body.data.cantidad).toBe(payload.cantidad);
    expect(response.body.data.precio_unitario).toBe(payload.precio_unitario);
    expect(response.body.data.categoria).toBe(payload.categoria);
  });

  it('debe validar datos inválidos - nombre requerido (400)', async () => {
    const token = await getAuthToken(USER_TEST);

    const payload = {
      descripcion: 'Descripción del producto',
      cantidad: 10,
      precio_unitario: 100.00,
    };

    const response = await request(app)
      .post('/api/inventario')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe validar datos inválidos - cantidad requerida (400)', async () => {
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Nuevo',
      descripcion: 'Descripción del producto',
      precio_unitario: 100.00,
    };

    const response = await request(app)
      .post('/api/inventario')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe validar datos inválidos - precio_unitario requerido (400)', async () => {
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Nuevo',
      descripcion: 'Descripción del producto',
      cantidad: 10,
    };

    const response = await request(app)
      .post('/api/inventario')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe crear producto sin descripción ni categoría (opcional) (201)', async () => {
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Simple',
      cantidad: 5,
      precio_unitario: 50.00,
    };

    const response = await request(app)
      .post('/api/inventario')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.nombre).toBe(payload.nombre);
  });
});
