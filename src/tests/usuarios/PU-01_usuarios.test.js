import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';
import {
  loginTestUser,
  registerTestUser,
} from '../helpers/testAuth.js';

const ADMIN_TEST = {
  nombre: 'Admin',
  apellido: 'Test',
  correo: 'admin.pu02@example.com',
  contrasena: 'AdminPass123!',
};

const USER_TEST = {
  nombre: 'User',
  apellido: 'Test',
  correo: 'user.pu02@example.com',
  contrasena: 'UserPass123!',
};

async function getAuthToken(credentials) {
  const res = await loginTestUser(
    app,
    credentials.correo,
    credentials.contrasena,
  );
  return res.body.token;
}

describe.sequential('PU-01 | Usuarios - Endpoints', () => {
  it('debe denegar el acceso a GET /api/usuarios si no hay token (401)', async () => {
    const response = await request(app).get('/api/usuarios');
    expect(response.status).toBe(401);
  });

  it('debe denegar el acceso a GET /api/usuarios si el usuario no es Admin (403)', async () => {
    await registerTestUser(app, USER_TEST);
    const token = await getAuthToken(USER_TEST);

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Sin permiso');
  });

  it('debe permitir listar usuarios a un usuario con rol Administrador (200)', async () => {
    await registerTestUser(app, ADMIN_TEST);

    await prisma.usuario.update({
      where: { correo: ADMIN_TEST.correo },
      data: { id_tipo_usuario: 1 },
    });

    const token = await getAuthToken(ADMIN_TEST);

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(
      response.body.data.every((user) => user.contrasena === undefined),
    ).toBe(true);
  });
});
