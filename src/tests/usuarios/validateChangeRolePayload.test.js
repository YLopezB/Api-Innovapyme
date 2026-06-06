import { describe, it, expect } from 'vitest';
import {
  normalizeChangeRoleBody,
  validateChangeRole,
  validateUnknownFields,
} from '../../controller/usuarios/validateChangeRolePayload.js';

describe('validateChangeRolePayload', () => {
  it('normaliza id_tipo_usuario del body', () => {
    expect(normalizeChangeRoleBody({ id_tipo_usuario: 2 })).toEqual({
      id_tipo_usuario: 2,
    });
  });

  it('rechaza campos no permitidos', () => {
    expect(validateUnknownFields({ nombre: 'x' })).toBe(
      'Campo(s) no permitido(s): nombre',
    );
  });

  it('rechaza id_tipo_usuario faltante', () => {
    expect(validateChangeRole({})).toBe('id_tipo_usuario es requerido');
  });

  it('rechaza id_tipo_usuario inválido', () => {
    expect(validateChangeRole({ id_tipo_usuario: 'x' })).toBe(
      'id_tipo_usuario debe ser un entero válido',
    );
  });

  it('acepta roles 2 y 3', () => {
    expect(validateChangeRole({ id_tipo_usuario: 2 })).toBeNull();
    expect(validateChangeRole({ id_tipo_usuario: 3 })).toBeNull();
  });
});
