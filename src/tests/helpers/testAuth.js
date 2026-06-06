import request from 'supertest';
import { cleanTestUsersByEmails } from '../setup/setupDatabase.js';

export async function registerTestUser(app, usuario) {
  await cleanTestUsersByEmails([usuario.correo]);

  const response = await request(app)
    .post('/api/auth/registro')
    .send(usuario);

  return response;
}

export async function loginTestUser(app, correo, contrasena) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ correo, contrasena });

  return response;
}
