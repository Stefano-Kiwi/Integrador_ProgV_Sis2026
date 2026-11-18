import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service.js';
import { PagosRepository } from './pagos.repository.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPagosRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findReservaCancha: vi.fn(),
  findMembresia: vi.fn(),
  procesarPago: vi.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('PagosService', () => {
  let service: PagosService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: PagosRepository, useValue: mockPagosRepository },
      ],
    }).compile();

    service = module.get(PagosService);
  });

  // ── findById ───────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('debería devolver el pago cuando existe', async () => {
      const pago = { id: 1, monto: '8000', estado: 'APROBADO' };
      mockPagosRepository.findById.mockResolvedValue(pago);

      const result = await service.findById(1);
      expect(result).toEqual(pago);
    });

    it('debería lanzar NotFoundException cuando el pago no existe', async () => {
      mockPagosRepository.findById.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ── simularPago ────────────────────────────────────────────────────────────

  describe('simularPago()', () => {
    const pagoResultado = {
      id: 88,
      estado: 'APROBADO',
      monto: '8000',
      token_pasarela: 'tok_test',
    };
    const comprobanteResultado = {
      id: 12,
      pago_id: 88,
      archivo_url: 'https://fitzone.com/comprobantes/recibo-88.pdf',
      emitido_at: new Date('2026-11-10T00:00:00Z'),
    };

    it('debería procesar el pago de una cancha correctamente', async () => {
      mockPagosRepository.findReservaCancha.mockResolvedValue({ id: 1, estado: 'PENDIENTE_PAGO' });
      mockPagosRepository.procesarPago.mockResolvedValue({
        pago: pagoResultado,
        comprobante: comprobanteResultado,
      });

      const result = await service.simularPago({
        origen_tipo: 'cancha',
        origen_id: 1,
        monto: 8000,
      });

      expect(result.pago_id).toBe(88);
      expect(result.estado).toBe('APROBADO');
      expect(result.token_pasarela).toMatch(/^tok_/);
      expect(result.comprobante.archivo_url).toContain('recibo-88.pdf');
      expect(mockPagosRepository.findReservaCancha).toHaveBeenCalledWith(1);
      expect(mockPagosRepository.findMembresia).not.toHaveBeenCalled();
    });

    it('debería procesar el pago de una membresía correctamente', async () => {
      mockPagosRepository.findMembresia.mockResolvedValue({ id: 2, estado: 'PENDIENTE_PAGO' });
      mockPagosRepository.procesarPago.mockResolvedValue({
        pago: pagoResultado,
        comprobante: comprobanteResultado,
      });

      const result = await service.simularPago({
        origen_tipo: 'membresia',
        origen_id: 2,
        monto: 15000,
      });

      expect(result.estado).toBe('APROBADO');
      expect(mockPagosRepository.findMembresia).toHaveBeenCalledWith(2);
      expect(mockPagosRepository.findReservaCancha).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la reserva de cancha no existe', async () => {
      mockPagosRepository.findReservaCancha.mockResolvedValue(null);

      await expect(
        service.simularPago({ origen_tipo: 'cancha', origen_id: 999, monto: 8000 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException si la membresía no existe', async () => {
      mockPagosRepository.findMembresia.mockResolvedValue(null);

      await expect(
        service.simularPago({ origen_tipo: 'membresia', origen_id: 999, monto: 15000 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('el token_pasarela generado debería ser único en cada llamada', async () => {
      mockPagosRepository.findReservaCancha.mockResolvedValue({ id: 1 });
      mockPagosRepository.procesarPago.mockResolvedValue({
        pago: pagoResultado,
        comprobante: comprobanteResultado,
      });

      const dto = { origen_tipo: 'cancha' as const, origen_id: 1, monto: 8000 };
      const [r1, r2] = await Promise.all([service.simularPago(dto), service.simularPago(dto)]);

      expect(r1.token_pasarela).not.toBe(r2.token_pasarela);
    });
  });
});

