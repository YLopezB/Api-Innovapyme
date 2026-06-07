import { describe, it, expect } from 'vitest';
import { normalizeCreateBody, validateCreate } from '../../controller/ventas/validateVentaPayload.js';

describe('validateVentaPayload', () => {
  describe('normalizeCreateBody', () => {
    it('debe normalizar correctamente el payload', () => {
      const body = {
        clienteId: '1',
        productos: [
          { productoId: '1', cantidad: '2', precioUnitario: '10.50' },
          { productoId: '2', cantidad: '1', precioUnitario: '25.00' },
        ],
        total: '46.00',
      };

      const result = normalizeCreateBody(body);

      expect(result.clienteId).toBe(1);
      expect(result.productos).toHaveLength(2);
      expect(result.productos[0].productoId).toBe(1);
      expect(result.productos[0].cantidad).toBe(2);
      expect(result.productos[0].precioUnitario).toBe(10.50);
      expect(result.total).toBe(46.00);
    });

    it('debe manejar productos vacíos', () => {
      const body = {
        clienteId: '1',
        productos: null,
        total: '46.00',
      };

      const result = normalizeCreateBody(body);

      expect(result.productos).toEqual([]);
    });
  });

  describe('validateCreate', () => {
    it('debe validar payload correcto', () => {
      const payload = {
        clienteId: 1,
        productos: [
          { productoId: 1, cantidad: 2, precioUnitario: 10.50 },
        ],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBeNull();
    });

    it('debe rechazar clienteId inválido', () => {
      const payload = {
        clienteId: -1,
        productos: [
          { productoId: 1, cantidad: 2, precioUnitario: 10.50 },
        ],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('clienteId debe ser un entero positivo');
    });

    it('debe rechazar productos vacíos', () => {
      const payload = {
        clienteId: 1,
        productos: [],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('productos debe ser un array no vacío');
    });

    it('debe rechazar productoId inválido', () => {
      const payload = {
        clienteId: 1,
        productos: [
          { productoId: -1, cantidad: 2, precioUnitario: 10.50 },
        ],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('productos[0].productoId debe ser un entero positivo');
    });

    it('debe rechazar cantidad inválida', () => {
      const payload = {
        clienteId: 1,
        productos: [
          { productoId: 1, cantidad: 0, precioUnitario: 10.50 },
        ],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('productos[0].cantidad debe ser un entero positivo');
    });

    it('debe rechazar precioUnitario inválido', () => {
      const payload = {
        clienteId: 1,
        productos: [
          { productoId: 1, cantidad: 2, precioUnitario: -10.50 },
        ],
        total: 21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('productos[0].precioUnitario debe ser un número mayor o igual a 0');
    });

    it('debe rechazar total inválido', () => {
      const payload = {
        clienteId: 1,
        productos: [
          { productoId: 1, cantidad: 2, precioUnitario: 10.50 },
        ],
        total: -21.00,
      };

      const result = validateCreate(payload);

      expect(result).toBe('total debe ser un número mayor o igual a 0');
    });
  });
});
