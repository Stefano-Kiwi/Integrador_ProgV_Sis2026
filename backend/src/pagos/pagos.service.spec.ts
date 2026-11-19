import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service.js';
import { PagosRepository } from './pagos.repository.js';
import { ComprobantePdfService } from './comprobante-pdf.service.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPagosRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findReservaCancha: vi.fn(),
  findMembresia: vi.fn(),
  procesarPago: vi.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('PagosService y ComprobantePdfService (RF-13, RF-14)', () => {
  let service: PagosService;
  let pdfService: ComprobantePdfService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        ComprobantePdfService,
        { provide: PagosRepository, useValue: mockPagosRepository },
      ],
    }).compile();

    service = module.get(PagosService);
    pdfService = module.get(ComprobantePdfService);
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
      archivo_url: 'storage/comprobantes/recibo-88.pdf',
      emitido_at: new Date('2026-11-10T00:00:00Z'),
    };

    it('debería procesar el pago de una cancha y generar el comprobante PDF real', async () => {
      const spyGuardar = vi
        .spyOn(pdfService, 'guardarPdf')
        .mockReturnValue('storage/comprobantes/recibo-88.pdf');

      mockPagosRepository.findReservaCancha.mockResolvedValue({
        id: 1,
        cancha_id: 1,
        fecha: new Date('2026-12-01'),
        hora_inicio: 19,
        estado: 'PENDIENTE_PAGO',
        cancha: { nombre: 'Cancha 1 (Paddle)' },
      });
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
      expect(result.comprobante.archivo_url).toBe('storage/comprobantes/recibo-88.pdf');
      expect(result.comprobante.descarga_url).toBe('/pagos/88/comprobante');
      expect(spyGuardar).toHaveBeenCalledWith(
        expect.objectContaining({
          pagoId: 88,
          concepto: 'Reserva de Cancha Deportiva',
          monto: 8000,
        }),
      );
    });

    it('debería procesar el pago de una membresía correctamente', async () => {
      vi.spyOn(pdfService, 'guardarPdf').mockReturnValue('storage/comprobantes/recibo-88.pdf');
      mockPagosRepository.findMembresia.mockResolvedValue({
        id: 2,
        plan_id: 1,
        estado: 'PENDIENTE_PAGO',
        plan_membresia: { nombre: 'Mensual' },
      });
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
    });

    it('debería lanzar NotFoundException si la reserva de cancha o membresía no existen', async () => {
      mockPagosRepository.findReservaCancha.mockResolvedValue(null);
      await expect(
        service.simularPago({ origen_tipo: 'cancha', origen_id: 999, monto: 8000 }),
      ).rejects.toThrow(NotFoundException);

      mockPagosRepository.findMembresia.mockResolvedValue(null);
      await expect(
        service.simularPago({ origen_tipo: 'membresia', origen_id: 999, monto: 15000 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('el token_pasarela generado debería ser único en cada llamada', async () => {
      vi.spyOn(pdfService, 'guardarPdf').mockReturnValue('storage/comprobantes/recibo-88.pdf');
      mockPagosRepository.findReservaCancha.mockResolvedValue({
        id: 1,
        cancha_id: 1,
        fecha: new Date('2026-12-01'),
        hora_inicio: 18,
      });
      mockPagosRepository.procesarPago.mockResolvedValue({
        pago: pagoResultado,
        comprobante: comprobanteResultado,
      });

      const dto = { origen_tipo: 'cancha' as const, origen_id: 1, monto: 8000 };
      const [r1, r2] = await Promise.all([service.simularPago(dto), service.simularPago(dto)]);

      expect(r1.token_pasarela).not.toBe(r2.token_pasarela);
    });
  });

  // ── RF-14: Generación y descarga de PDF real ───────────────────────────────

  describe('ComprobantePdfService y obtenerComprobantePdf() (RF-14)', () => {
    it('debería generar un buffer PDF 1.4 válido con concepto, cancha/horario, monto y fecha', () => {
      const buf = pdfService.generarBuffer({
        pagoId: 42,
        concepto: 'Reserva de Cancha Deportiva',
        detalle: 'Cancha 1 (Paddle) - 2026-12-01 19:00 a 20:00 hs',
        monto: 9600,
        fecha: new Date('2026-11-19T15:00:00.000Z'),
        tokenPasarela: 'tok_abc123',
      });

      const contenido = buf.toString('utf-8');
      expect(contenido.startsWith('%PDF-1.4')).toBe(true);
      expect(contenido).toContain('Reserva de Cancha Deportiva');
      expect(contenido).toContain('Cancha 1');
      expect(contenido).toContain('19:00 a 20:00 hs');
      expect(contenido).toContain('$ 9600.00');
      expect(contenido).toContain('%%EOF');
    });

    it('obtenerComprobantePdf(): debería devolver el PDF y filename para un pago existente', async () => {
      vi.spyOn(pdfService, 'leerPdf').mockReturnValue(null);
      mockPagosRepository.findById.mockResolvedValue({
        id: 42,
        monto: '9600.00',
        token_pasarela: 'tok_abc123',
        comprobante: {
          id: 5,
          archivo_url: 'storage/comprobantes/recibo-42.pdf',
          emitido_at: new Date('2026-11-19T15:00:00.000Z'),
        },
        reserva_cancha: {
          cancha_id: 1,
          fecha: new Date('2026-12-01'),
          hora_inicio: 19,
          cancha: { nombre: 'Cancha 1 (Paddle)' },
        },
        membresia: null,
      });

      const { buffer, filename } = await service.obtenerComprobantePdf(42);
      expect(filename).toBe('comprobante-pago-42.pdf');
      expect(buffer.toString('utf-8').startsWith('%PDF-1.4')).toBe(true);
    });
  });
});
