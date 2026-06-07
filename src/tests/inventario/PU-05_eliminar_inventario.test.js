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
  correo: 'user.eliminar.inventario@example.com',
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
      nombre_producto: 'Producto a Eliminar',
      descripcion: 'Descripción del producto',
      cantidad: 10,
      precio_unitario: 100.00,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  return { usuario, producto };
}

describe.sequential('PU-05 | Inventario - Eliminar inventario', () => {
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
      await prisma.venta.deleteMany({
        where: {
          id_usuario: usuario.id,
        },
      });
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

  it('debe denegar el acceso a DELETE /api/inventario/:id si no hay token (401)', async () => {
    const response = await request(app).delete('/api/inventario/1');
    expect(response.status).toBe(401);
  });

  it('debe eliminar producto exitosamente (200)', async () => {
    const { producto } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .delete(`/api/inventario/${producto.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Eliminado');

    const deletedProducto = await prisma.inventario.findUnique({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('debe retornar 404 para producto inexistente', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .delete('/api/inventario/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe retornar 400 si tiene ventas asociadas', async () => {
    const { usuario, producto } = await setupTestData();
    const token = await getAuthToken(USER_TEST);

    await prisma.venta.create({
      data: {
        id_usuario: usuario.id,
        id_inventario: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio_unitario,
        total: producto.precio_unitario,
      },
    });

    const response = await request(app)
      .delete(`/api/inventario/${producto.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Tiene ventas');
  });
});
