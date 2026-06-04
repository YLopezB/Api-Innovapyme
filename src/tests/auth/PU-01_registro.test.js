import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { cleanTestUsers, disconnectDatabase } from '../setup/setupDatabase.js';

// ─── Datos del usuario de prueba ────────────────────────────────────────────
const USUARIO_VALIDO = {
  nombre: 'Test',
  apellido: 'PU01',
  correo: 'test.pu01@example.com',
  contrasena: 'Password123!',
  telefono: '3001234567',
};

// ─── Limpieza ────────────────────────────────────────────────────────────────
beforeEach(async () => {
  // Garantiza que el correo no exista antes de cada test
  await cleanTestUsers();
});

afterAll(async () => {
  // Limpieza final y cierre de conexión
  await cleanTestUsers();
  await disconnectDatabase();
});

// ─── Suite PU-01 ─────────────────────────────────────────────────────────────
describe('PU-01 | AuthService — Registrar usuario', () => {
  /**
   * Caso principal: correo no existente → se crea el usuario correctamente
   */
  it('debe retornar HTTP 201 con success:true y un token cuando el correo no existe', async () => {
    const response = await request(app)
      .post('/api/auth/registro')
      .send(USUARIO_VALIDO);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Usuario creado');
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });

  /**
   * Caso borde: correo duplicado → debe rechazar con 409
   * (complementa PU-01 verificando que la unicidad funciona)
   */
  it('debe retornar HTTP 409 si el correo ya está registrado', async () => {
    // Primer registro (exitoso)
    await request(app).post('/api/auth/registro').send(USUARIO_VALIDO);

    // Segundo registro con el mismo correo
    const response = await request(app)
      .post('/api/auth/registro')
      .send(USUARIO_VALIDO);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Correo duplicado');
  });
});
