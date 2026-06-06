import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { registerTestUser } from '../helpers/testAuth.js';

const USUARIO_VALIDO = {
  nombre: 'Test',
  apellido: 'PU01',
  correo: 'test.pu01@example.com',
  contrasena: 'Password123!',
  telefono: '3001234567',
};

describe.sequential('PU-01 | AuthService — Registrar usuario', () => {
  it('debe retornar HTTP 201 con success:true y un token cuando el correo no existe', async () => {
    const response = await registerTestUser(app, USUARIO_VALIDO);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Usuario creado');
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });

  it('debe retornar HTTP 409 si el correo ya está registrado', async () => {
    await registerTestUser(app, USUARIO_VALIDO);

    const response = await request(app)
      .post('/api/auth/registro')
      .send(USUARIO_VALIDO);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Correo duplicado');
  });
});
