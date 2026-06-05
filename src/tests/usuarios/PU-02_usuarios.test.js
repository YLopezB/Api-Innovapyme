import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import prisma from '../../config/database.js';
import { disconnectDatabase } from '../setup/setupDatabase.js';

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

const PU02_EMAILS = [ADMIN_TEST.correo, USER_TEST.correo];

async function cleanPU02Users() {
  await prisma.usuario.deleteMany({
    where: {
      correo: { in: PU02_EMAILS },
    },
  });
}

beforeEach(async () => {
  await cleanPU02Users();
});

afterAll(async () => {
  await cleanPU02Users();
  await disconnectDatabase();
});

async function getAuthToken(credentials) {
  const res = await request(app).post('/api/auth/login').send({
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  });
  return res.body.token;
}

describe('PU-02 | Usuarios - Endpoints', () => {
  it('debe denegar el acceso a GET /api/usuarios si no hay token (401)', async () => {
    const response = await request(app).get('/api/usuarios');
    expect(response.status).toBe(401);
  });

  it('debe denegar el acceso a GET /api/usuarios si el usuario no es Admin (403)', async () => {
    // 1. Registrar usuario común
    await request(app).post('/api/auth/registro').send(USER_TEST);
    const token = await getAuthToken(USER_TEST);

    // 2. Intentar listar
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Sin permiso');
  });

  it('debe permitir listar usuarios a un usuario con rol Administrador (200)', async () => {
    // 1. Registrar admin test
    await request(app).post('/api/auth/registro').send(ADMIN_TEST);
    
    // Cambiar rol a admin en base de datos
    await prisma.usuario.update({
      where: { correo: ADMIN_TEST.correo },
      data: { id_tipo_usuario: 1 }
    });

    const token = await getAuthToken(ADMIN_TEST);

    // 2. Listar usuarios
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Verificar que no se exponga la contraseña
    expect(response.body.data.every(user => user.contrasena === undefined)).toBe(true);
  });
});
