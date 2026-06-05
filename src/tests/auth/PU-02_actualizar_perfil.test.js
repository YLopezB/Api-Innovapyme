import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';

const CONTRASENA = 'Password123!';

const USUARIOS = {
  valido: {
    nombre: 'Test',
    apellido: 'PU02',
    correo: 'test.pu02.valido@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  vacio: {
    nombre: 'Test',
    apellido: 'PU02',
    correo: 'test.pu02.vacio@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  nombreVacio: {
    nombre: 'Test',
    apellido: 'PU02',
    correo: 'test.pu02.nombre@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  correoInvalido: {
    nombre: 'Test',
    apellido: 'PU02',
    correo: 'test.pu02.correo@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  campoNoPermitido: {
    nombre: 'Test',
    apellido: 'PU02',
    correo: 'test.pu02.campo@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  duplicadoA: {
    nombre: 'Test',
    apellido: 'PU02A',
    correo: 'test.pu02.dup.a@example.com',
    contrasena: CONTRASENA,
    telefono: '3001234567',
  },
  duplicadoB: {
    nombre: 'Otro',
    apellido: 'Usuario',
    correo: 'test.pu02.dup.b@example.com',
    contrasena: CONTRASENA,
    telefono: '3009876543',
  },
};

async function limpiarCorreos(correos) {
  await prisma.usuario.deleteMany({
    where: { correo: { in: correos } },
  });
}

async function registrarUsuario(usuario) {
  await limpiarCorreos([usuario.correo]);
  const response = await request(app)
    .post('/api/auth/registro')
    .send(usuario);
  expect(response.status).toBe(201);
}

async function obtenerToken(correo, contrasena) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ correo, contrasena });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();

  return response.body.token;
}

const PU02_EMAILS = Object.values(USUARIOS).map((u) => u.correo);

afterAll(async () => {
  await limpiarCorreos(PU02_EMAILS);
});

describe('PU-02 | AuthService — Actualizar perfil', () => {
  it('debe retornar HTTP 200 cuando los datos son válidos', async () => {
    const usuario = USUARIOS.valido;
    await registrarUsuario(usuario);
    const token = await obtenerToken(usuario.correo, usuario.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Juana', telefono: '3098765432' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Actualizado');
    expect(response.body.data.nombre).toBe('Juana');
    expect(response.body.data.telefono).toBe('3098765432');
  });

  it('debe retornar HTTP 400 cuando el body está vacío', async () => {
    const usuario = USUARIOS.vacio;
    await registrarUsuario(usuario);
    const token = await obtenerToken(usuario.correo, usuario.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Datos inválidos');
  });

  it('debe retornar HTTP 400 cuando el nombre está vacío', async () => {
    const usuario = USUARIOS.nombreVacio;
    await registrarUsuario(usuario);
    const token = await obtenerToken(usuario.correo, usuario.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('El nombre no puede estar vacío');
  });

  it('debe retornar HTTP 400 cuando el correo tiene formato inválido', async () => {
    const usuario = USUARIOS.correoInvalido;
    await registrarUsuario(usuario);
    const token = await obtenerToken(usuario.correo, usuario.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ correo: 'correo-invalido' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('El correo no tiene un formato válido');
  });

  it('debe retornar HTTP 400 cuando se envía un campo no permitido', async () => {
    const usuario = USUARIOS.campoNoPermitido;
    await registrarUsuario(usuario);
    const token = await obtenerToken(usuario.correo, usuario.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ contrasena: 'NuevaPassword123!' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Campo(s) no permitido(s): contrasena');
  });

  it('debe retornar HTTP 400 cuando el correo ya está registrado', async () => {
    const usuarioA = USUARIOS.duplicadoA;
    const usuarioB = USUARIOS.duplicadoB;
    await limpiarCorreos([usuarioA.correo, usuarioB.correo]);
    await registrarUsuario(usuarioA);
    await registrarUsuario(usuarioB);
    const token = await obtenerToken(usuarioA.correo, usuarioA.contrasena);

    const response = await request(app)
      .put('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ correo: usuarioB.correo });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('El correo ya está registrado');
  });
});
