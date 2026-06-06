import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';
import {
  loginTestUser,
  registerTestUser,
} from '../helpers/testAuth.js';

const ROL_CLIENTE = 2;

const ADMIN_TEST = {
  nombre: 'Admin',
  apellido: 'PU05',
  correo: 'admin.pu05@example.com',
  contrasena: 'AdminPass123!',
};

const USER_TEST = {
  nombre: 'User',
  apellido: 'PU05',
  correo: 'user.pu05@example.com',
  contrasena: 'UserPass123!',
};

const TARGET_TEST = {
  nombre: 'Target',
  apellido: 'PU05',
  correo: 'test.pu05.target@example.com',
  contrasena: 'TargetPass123!',
};

async function getAdminToken() {
  await registerTestUser(app, ADMIN_TEST);
  await prisma.usuario.update({
    where: { correo: ADMIN_TEST.correo },
    data: { id_tipo_usuario: 1 },
  });
  const res = await loginTestUser(
    app,
    ADMIN_TEST.correo,
    ADMIN_TEST.contrasena,
  );
  expect(res.status).toBe(200);
  return res.body.token;
}

async function registerInactiveTarget() {
  const res = await registerTestUser(app, TARGET_TEST);
  expect(res.status).toBe(201);
  const user = await prisma.usuario.findFirst({
    where: { correo: TARGET_TEST.correo },
    select: { id: true },
  });
  await prisma.usuario.update({
    where: { id: user.id },
    data: { id_tipo_usuario: ROL_CLIENTE, estado: false },
  });
  return user;
}

describe.sequential('PU-04 | Usuarios — Reactivar usuario', () => {
  it('debe retornar HTTP 401 si no hay token', async () => {
    const response = await request(app).patch('/api/usuarios/1/reactivar');

    expect(response.status).toBe(401);
  });

  it('debe retornar HTTP 403 si el usuario no es Administrador', async () => {
    await registerTestUser(app, USER_TEST);
    const login = await loginTestUser(
      app,
      USER_TEST.correo,
      USER_TEST.contrasena,
    );
    const target = await registerInactiveTarget();

    const response = await request(app)
      .patch(`/api/usuarios/${target.id}/reactivar`)
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Sin permiso');
  });

  it('debe retornar HTTP 200 y reactivar un usuario inactivo', async () => {
    const token = await getAdminToken();
    const target = await registerInactiveTarget();

    const response = await request(app)
      .patch(`/api/usuarios/${target.id}/reactivar`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Reactivado');
    expect(response.body.data.estado).toBe(true);
    expect(response.body.data.id_tipo_usuario).toBe(ROL_CLIENTE);
    expect(response.body.data.contrasena).toBeUndefined();
  });

  it('debe retornar HTTP 200 de forma idempotente si ya está activo', async () => {
    const token = await getAdminToken();
    const target = await registerInactiveTarget();

    await prisma.usuario.update({
      where: { id: target.id },
      data: { estado: true },
    });

    const response = await request(app)
      .patch(`/api/usuarios/${target.id}/reactivar`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reactivado');
    expect(response.body.data.estado).toBe(true);
  });

  it('debe retornar HTTP 404 si el usuario no existe', async () => {
    const token = await getAdminToken();

    const response = await request(app)
      .patch('/api/usuarios/999999/reactivar')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe permitir el login tras reactivar al usuario', async () => {
    const token = await getAdminToken();
    const target = await registerInactiveTarget();

    const blockedLogin = await loginTestUser(
      app,
      TARGET_TEST.correo,
      TARGET_TEST.contrasena,
    );
    expect(blockedLogin.status).toBe(403);

    await request(app)
      .patch(`/api/usuarios/${target.id}/reactivar`)
      .set('Authorization', `Bearer ${token}`);

    const login = await loginTestUser(
      app,
      TARGET_TEST.correo,
      TARGET_TEST.contrasena,
    );

    expect(login.status).toBe(200);
    expect(login.body.success).toBe(true);
  });
});
