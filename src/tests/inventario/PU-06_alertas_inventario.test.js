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
  correo: 'user.alertas.inventario@example.com',
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

  const productoAlerta = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto en Alerta',
      descripcion: 'Descripción del producto',
      cantidad: 3,
      precio_unitario: 100.00,
      categoria: 'Categoria 1',
      id_usuario: usuario.id,
    },
  });

  const productoNormal = await prisma.inventario.create({
    data: {
      nombre_producto: 'Producto Normal',
      descripcion: 'Descripción del producto',
      cantidad: 20,
      precio_unitario: 200.00,
      categoria: 'Categoria 2',
      id_usuario: usuario.id,
    },
  });

  return { usuario, productoAlerta, productoNormal };
}

describe.sequential('PU-06 | Inventario - Alertas de inventario', () => {
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

  it('debe denegar el acceso a GET /api/inventario/alertas si no hay token (401)', async () => {
    const response = await request(app).get('/api/inventario/alertas');
    expect(response.status).toBe(401);
  });

  it('debe listar productos en alerta por bajo stock (200)', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario/alertas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Lista de productos en alerta');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debe respetar parámetro de stock personalizado (200)', async () => {
    await setupTestData();
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario/alertas?stock=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debe retornar array vacío si no hay productos en alerta', async () => {
    let usuario = await prisma.usuario.findUnique({
      where: { correo: USER_TEST.correo },
    });

    if (!usuario) {
      await registerTestUser(app, USER_TEST);
      usuario = await prisma.usuario.findUnique({
        where: { correo: USER_TEST.correo },
      });
    }

    await prisma.inventario.create({
      data: {
        nombre_producto: 'Producto con Stock Alto',
        descripcion: 'Descripción del producto',
        cantidad: 50,
        precio_unitario: 100.00,
        categoria: 'Categoria 1',
        id_usuario: usuario.id,
      },
    });

    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/inventario/alertas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(0);
  });
});
