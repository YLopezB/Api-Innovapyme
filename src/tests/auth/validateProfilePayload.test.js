import { describe, it, expect } from 'vitest';
import {
  normalizeUpdateBody,
  validateUnknownFields,
  validateUpdate,
} from '../../controller/auth/validateProfilePayload.js';

describe('validateProfilePayload', () => {
  describe('normalizeUpdateBody', () => {
    it('recorta strings y convierte teléfono vacío en null', () => {
      expect(
        normalizeUpdateBody({
          nombre: '  Juana  ',
          telefono: '   ',
        }),
      ).toEqual({
        nombre: 'Juana',
        telefono: null,
      });
    });

    it('retorna objeto vacío si no hay campos permitidos', () => {
      expect(normalizeUpdateBody({})).toEqual({});
    });
  });

  describe('validateUpdate', () => {
    it('acepta objeto normalizado vacío sin reglas de campo', () => {
      expect(validateUpdate({})).toBeNull();
    });

    it('rechaza nombre vacío', () => {
      const data = normalizeUpdateBody({ nombre: '   ' });
      expect(validateUpdate(data)).toBe('El nombre no puede estar vacío');
    });

    it('rechaza apellido vacío', () => {
      const data = normalizeUpdateBody({ apellido: '' });
      expect(validateUpdate(data)).toBe('El apellido no puede estar vacío');
    });

    it('rechaza correo con formato inválido', () => {
      const data = normalizeUpdateBody({ correo: 'no-es-email' });
      expect(validateUpdate(data)).toBe(
        'El correo no tiene un formato válido',
      );
    });

    it('rechaza campos no permitidos', () => {
      expect(validateUnknownFields({ contrasena: 'x' })).toBe(
        'Campo(s) no permitido(s): contrasena',
      );
    });

    it('acepta payload válido parcial', () => {
      const data = normalizeUpdateBody({
        nombre: 'Juana',
        correo: 'juana@example.com',
      });
      expect(validateUpdate(data)).toBeNull();
    });
  });
});
