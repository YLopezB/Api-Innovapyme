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
  apellido: 'PU04',
  correo: 'admin.pu04@example.com',
  contrasena: 'AdminPass123!',
};

const USER_TEST = {
  nombre: 'User',
  apellido: 'PU04',
  correo: 'user.pu04@example.com',
  contrasena: 'UserPass123!',
};

const TARGET_TEST = {
  nombre: 'Target',
  apellido: 'PU04',
  correo: 'test.pu04.target@example.com',
  contrasena: 'TargetPass123!',
};

const ADMIN_TARGET_TEST = {
  nombre: 'AdminTarget',
  apellido: 'PU04',
  correo: 'test.pu04.admin@example.com',
  contrasena: 'AdminTarget123!',
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

async function registerTargetUser(usuario = TARGET_TEST) {
  const res = await registerTestUser(app, usuario);
  expect(res.status).toBe(201);
  return prisma.usuario.findFirst({
    where: { correo: usuario.correo },
    select: { id: true, id_tipo_usuario: true, estado: true },
  });
}

describe.sequential('PU-03 | Usuarios — Desactivar usuario', () => {
  it('debe retornar HTTP 401 si no hay token', async () => {
    const response = await request(app).delete('/api/usuarios/1');

    expect(response.status).toBe(401);
  });

  it('debe retornar HTTP 403 si el usuario no es Administrador', async () => {
    await registerTestUser(app, USER_TEST);
    const login = await loginTestUser(
      app,
      USER_TEST.correo,
      USER_TEST.contrasena,
    );
    const target = await registerTargetUser();

    const response = await request(app)
      .delete(`/api/usuarios/${target.id}`)
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Sin permiso');
  });

  it('debe retornar HTTP 200 y desactivar un usuario Cliente (2)', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    await prisma.usuario.update({
      where: { id: target.id },
      data: { id_tipo_usuario: ROL_CLIENTE },
    });

    const response = await request(app)
      .delete(`/api/usuarios/${target.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Desactivado');
    expect(response.body.data.estado).toBe(false);
    expect(response.body.data.id_tipo_usuario).toBe(ROL_CLIENTE);
    expect(response.body.data.contrasena).toBeUndefined();
  });

  it('debe retornar HTTP 200 de forma idempotente si ya está desactivado', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    await prisma.usuario.update({
      where: { id: target.id },
      data: { id_tipo_usuario: ROL_CLIENTE, estado: false },
    });

    const response = await request(app)
      .delete(`/api/usuarios/${target.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Desactivado');
    expect(response.body.data.estado).toBe(false);
  });

  it('debe retornar HTTP 400 al intentar desactivar un administrador', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser(ADMIN_TARGET_TEST);

    await prisma.usuario.update({
      where: { id: target.id },
      data: { id_tipo_usuario: 1 },
    });

    const response = await request(app)
      .delete(`/api/usuarios/${target.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No puedes desactivar un administrador');
  });

  it('debe retornar HTTP 404 si el usuario no existe', async () => {
    const token = await getAdminToken();

    const response = await request(app)
      .delete('/api/usuarios/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe impedir el login tras desactivar al usuario', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    await prisma.usuario.update({
      where: { id: target.id },
      data: { id_tipo_usuario: ROL_CLIENTE },
    });

    await request(app)
      .delete(`/api/usuarios/${target.id}`)
      .set('Authorization', `Bearer ${token}`);

    const login = await loginTestUser(
      app,
      TARGET_TEST.correo,
      TARGET_TEST.contrasena,
    );

    expect(login.status).toBe(403);
    expect(login.body.message).toBe('Usuario no autorizado');
  });
});
