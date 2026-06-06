import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';
import {
  loginTestUser,
  registerTestUser,
} from '../helpers/testAuth.js';

const ROL_CLIENTE = 2;
const ROL_VISITANTE = 3;

const ADMIN_TEST = {
  nombre: 'Admin',
  apellido: 'PU03',
  correo: 'admin.pu03@example.com',
  contrasena: 'AdminPass123!',
};

const USER_TEST = {
  nombre: 'User',
  apellido: 'PU03',
  correo: 'user.pu03@example.com',
  contrasena: 'UserPass123!',
};

const TARGET_TEST = {
  nombre: 'Target',
  apellido: 'PU03',
  correo: 'test.pu03.target@example.com',
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

async function registerTargetUser() {
  const res = await registerTestUser(app, TARGET_TEST);
  expect(res.status).toBe(201);
  const user = await prisma.usuario.findFirst({
    where: { correo: TARGET_TEST.correo },
    select: { id: true, id_tipo_usuario: true },
  });
  return user;
}

describe.sequential('PU-02 | Usuarios — Cambiar rol', () => {
  it('debe retornar HTTP 401 si no hay token', async () => {
    const response = await request(app)
      .put('/api/usuarios/1/rol')
      .send({ id_tipo_usuario: ROL_CLIENTE });

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
      .put(`/api/usuarios/${target.id}/rol`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ id_tipo_usuario: ROL_CLIENTE });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Sin permiso');
  });

  it('debe retornar HTTP 200 y asignar rol Cliente (2)', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();
    expect(target.id_tipo_usuario).toBe(ROL_VISITANTE);

    const response = await request(app)
      .put(`/api/usuarios/${target.id}/rol`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id_tipo_usuario: ROL_CLIENTE });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Actualizado');
    expect(response.body.data.id_tipo_usuario).toBe(ROL_CLIENTE);
    expect(response.body.data.contrasena).toBeUndefined();
  });

  it('debe retornar HTTP 200 y asignar rol Visitante (3)', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    await prisma.usuario.update({
      where: { id: target.id },
      data: { id_tipo_usuario: ROL_CLIENTE },
    });

    const response = await request(app)
      .put(`/api/usuarios/${target.id}/rol`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id_tipo_usuario: ROL_VISITANTE });

    expect(response.status).toBe(200);
    expect(response.body.data.id_tipo_usuario).toBe(ROL_VISITANTE);
  });

  it('debe retornar HTTP 404 si el usuario no existe', async () => {
    const token = await getAdminToken();

    const response = await request(app)
      .put('/api/usuarios/999999/rol')
      .set('Authorization', `Bearer ${token}`)
      .send({ id_tipo_usuario: ROL_CLIENTE });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No encontrado');
  });

  it('debe retornar HTTP 400 si id_tipo_usuario no existe', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    const response = await request(app)
      .put(`/api/usuarios/${target.id}/rol`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id_tipo_usuario: 999 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('id_tipo_usuario no existe');
  });

  it('debe retornar HTTP 400 si el body está vacío', async () => {
    const token = await getAdminToken();
    const target = await registerTargetUser();

    const response = await request(app)
      .put(`/api/usuarios/${target.id}/rol`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Datos inválidos');
  });
});
