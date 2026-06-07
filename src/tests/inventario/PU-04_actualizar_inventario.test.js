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
  correo: 'user.actualizar.inventario@example.com',
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

  const producto = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto Original',
      descripcion: 'Descripción original',
      cantidad: 10,
      precio_unitario: 100.00,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  return { usuario, producto };
}

describe.sequential('PU-04 | Inventario - Actualizar inventario', () => {
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

  it('debe denegar el acceso a PUT /api/inventario/:id si no hay token (401)', async () => {
    const response = await request(app).put('/api/inventario/1');
    expect(response.status).toBe(401);
  });

  it('debe actualizar producto exitosamente (200)', async () => {
    const { producto } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Actualizado',
      descripcion: 'Descripción actualizada',
      cantidad: 20,
      precio_unitario: 150.00,
      categoria: 'Categoria 2',
    };

    const response = await request(app)
      .put(`/api/inventario/${producto.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Actualizado');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.nombre).toBe(payload.nombre);
    expect(response.body.data.descripcion).toBe(payload.descripcion);
    expect(response.body.data.cantidad).toBe(payload.cantidad);
    expect(response.body.data.precio_unitario).toBe(payload.precio_unitario);
    expect(response.body.data.categoria).toBe(payload.categoria);
  });

  it('debe actualizar parcialmente el producto (200)', async () => {
    const { producto } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      cantidad: 15,
    };

    const response = await request(app)
      .put(`/api/inventario/${producto.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.cantidad).toBe(payload.cantidad);
  });

  it('debe retornar 404 para producto inexistente', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: 'Producto Actualizado',
    };

    const response = await request(app)
      .put('/api/inventario/99999')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe validar datos inválidos - nombre vacío (400)', async () => {
    const { producto } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const payload = {
      nombre: '',
    };

    const response = await request(app)
      .put(`/api/inventario/${producto.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
