import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CanchasService } from './canchas.service.js';
import { CanchasRepository } from './canchas.repository.js';
import {
  PRICING_STRATEGIES,
  PRICING_STRATEGY_CLASSES,
  PricingService,
} from './pricing/index.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockCanchasRepository = {
  findAll: vi.fn(),
  findSedeBaseId: vi.fn(),
  findAllReservas: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  findReservaByTurno: vi.fn(),
  findReservasActivasByFecha: vi.fn(),
  findReservaById: vi.fn(),
  usuarioEsSocioActivo: vi.fn(),
  createReserva: vi.fn(),
  cancelarReserva: vi.fn(),
  updateEstado: vi.fn(),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const canchaHabilitada = {
  id: 1,
  nombre: 'Cancha 1 (Paddle)',
  costo_hora: '8000.00',
  estado: 'HABILITADA',
  tipo_cancha: { nombre: 'Paddle' },
  sede: { id: 1, nombre: 'FitZone Centro' },
};

const canchaMantenimiento = {
  ...canchaHabilitada,
  id: 3,
  estado: 'EN_MANTENIMIENTO',
};

const dtoReserva = {
  cancha_id: 1,
  usuario_id: 5,
  fecha: '2026-12-01',
  hora_inicio: 18,
};

const usuarioCliente = { sub: 5, id_rol: 1 };
const usuarioAdmin = { sub: 99, id_rol: 4 };

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CanchasService', () => {
  let service: CanchasService;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCanchasRepository.usuarioEsSocioActivo.mockResolvedValue(false);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanchasService,
        PricingService,
        ...PRICING_STRATEGY_CLASSES,
        {
          provide: PRICING_STRATEGIES,
          useFactory: (...estrategias: unknown[]) => estrategias,
          inject: PRICING_STRATEGY_CLASSES,
        },
        { provide: CanchasRepository, useValue: mockCanchasRepository },
      ],
    }).compile();

    service = module.get(CanchasService);
  });

  // ── findAllReservas ────────────────────────────────────────────────────────

  describe('findAllReservas()', () => {
    it('debería devolver todas las reservas de canchas con usuarios y canchas asociadas', async () => {
      const mockReservas = [
        {
          id: 1,
          fecha: new Date('2026-11-20'),
          hora_inicio: 18,
          estado: 'PENDIENTE_PAGO',
          monto_total: '8000.00',
          usuario: {
            id: 3,
            nombre: 'Carlos',
            apellido: 'Gómez',
            email: 'carlos@fitzone.com',
            dni: '30000003',
          },
          cancha: {
            id: 1,
            nombre: 'Cancha 1 (Paddle)',
            tipo_cancha: { id: 1, nombre: 'Paddle' },
            sede: { id: 1, nombre: 'FitZone Concordia Centro' },
          },
        },
      ];

      mockCanchasRepository.findAllReservas.mockResolvedValue(mockReservas);

      const result = await service.findAllReservas(usuarioAdmin);

      expect(result).toEqual(mockReservas);
      expect(mockCanchasRepository.findAllReservas).toHaveBeenCalledOnce();
    });
  });

  // ── findById ───────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('debería devolver la cancha cuando existe', async () => {
      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      const result = await service.findById(1);
      expect(result).toEqual(canchaHabilitada);
    });

    it('debería lanzar NotFoundException cuando la cancha no existe', async () => {
      mockCanchasRepository.findById.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ── reservar ───────────────────────────────────────────────────────────────

  describe('reservar()', () => {
    it('debería crear la reserva aplicando TarifaExterno cuando no es socio activo (RN-03)', async () => {
      const reservaCreada = {
        id: 55,
        cancha_id: 1,
        usuario_id: 5,
        estado: 'PENDIENTE_PAGO',
        precio_base: '8000.00',
        descuento: '0.00',
        recargo: '0.00',
        monto_total: '8000.00',
      };

      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null);
      mockCanchasRepository.usuarioEsSocioActivo.mockResolvedValue(false);
      mockCanchasRepository.createReserva.mockResolvedValue(reservaCreada);

      const result = await service.reservar(dtoReserva);

      expect(result.estado).toBe('PENDIENTE_PAGO');
      expect(result.reserva_id).toBe(55);
      expect(result.precio.estrategias_aplicadas).toContain('TarifaExterno');
      expect(mockCanchasRepository.createReserva).toHaveBeenCalledWith(
        expect.objectContaining({
          cancha_id: 1,
          usuario_id: 5,
          hora_inicio: 18,
          precio_base: 8000,
          descuento: 0,
          recargo: 0,
          monto_total: 8000,
        }),
      );
    });

    it('debería aplicar 15% de descuento a socios activos fuera de horario pico (RF-11)', async () => {
      const reservaCreada = {
        id: 56,
        cancha_id: 1,
        usuario_id: 5,
        estado: 'PENDIENTE_PAGO',
        precio_base: '8000.00',
        descuento: '1200.00',
        recargo: '0.00',
        monto_total: '6800.00',
      };

      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null);
      mockCanchasRepository.usuarioEsSocioActivo.mockResolvedValue(true);
      mockCanchasRepository.createReserva.mockResolvedValue(reservaCreada);

      const result = await service.reservar(dtoReserva);

      expect(result.precio).toMatchObject({
        precio_base: 8000,
        descuento: 1200,
        recargo: 0,
        monto_total: 6800,
      });
      expect(mockCanchasRepository.createReserva).toHaveBeenCalledWith(
        expect.objectContaining({
          precio_base: 8000,
          descuento: 1200,
          recargo: 0,
          monto_total: 6800,
        }),
      );
    });

    it('debería combinar descuento de socio y recargo de horario pico (19:00 a 21:00)', async () => {
      const reservaCreada = {
        id: 57,
        cancha_id: 1,
        usuario_id: 5,
        estado: 'PENDIENTE_PAGO',
        precio_base: '10000.00',
        descuento: '1500.00',
        recargo: '2000.00',
        monto_total: '10500.00',
      };

      mockCanchasRepository.findById.mockResolvedValue({ ...canchaHabilitada, costo_hora: '10000.00' });
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null);
      mockCanchasRepository.usuarioEsSocioActivo.mockResolvedValue(true);
      mockCanchasRepository.createReserva.mockResolvedValue(reservaCreada);

      await service.reservar({ ...dtoReserva, hora_inicio: 19 });

      expect(mockCanchasRepository.createReserva).toHaveBeenCalledWith(
        expect.objectContaining({
          precio_base: 10000,
          descuento: 1500,
          recargo: 2000,
          monto_total: 10500,
        }),
      );
    });

    it('debería lanzar BadRequestException si la cancha está en mantenimiento', async () => {
      mockCanchasRepository.findById.mockResolvedValue(canchaMantenimiento);

      await expect(service.reservar({ ...dtoReserva, cancha_id: 3 })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.reservar({ ...dtoReserva, cancha_id: 3 })).rejects.toThrow(
        'mantenimiento',
      );
    });

    it('debería lanzar ConflictException si el turno ya está reservado', async () => {
      const reservaExistente = { id: 10, cancha_id: 1, hora_inicio: 18, estado: 'CONFIRMADA' };

      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(reservaExistente);

      await expect(service.reservar(dtoReserva)).rejects.toThrow(ConflictException);
    });

    it('RN-02: debería traducir error P2002 del índice único a ConflictException (409)', async () => {
      const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.22.0',
      });

      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null);
      mockCanchasRepository.createReserva.mockRejectedValue(p2002);

      await expect(service.reservar(dtoReserva)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar NotFoundException si la cancha no existe', async () => {
      mockCanchasRepository.findById.mockResolvedValue(null);

      await expect(service.reservar(dtoReserva)).rejects.toThrow(NotFoundException);
    });
  });

  // ── disponibilidad ─────────────────────────────────────────────────────────

  describe('disponibilidad()', () => {
    it('debería devolver franjas de 8 a 22 h marcando ocupadas y con precio calculado', async () => {
      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservasActivasByFecha.mockResolvedValue([
        { hora_inicio: 10 },
        { hora_inicio: 19 },
      ]);
      mockCanchasRepository.usuarioEsSocioActivo.mockResolvedValue(true);

      const res = await service.disponibilidad(1, '2026-12-01', 5, usuarioAdmin);

      expect(res.cancha_id).toBe(1);
      expect(res.franjas).toHaveLength(15); // 8..22 inclusive
      const f10 = res.franjas.find((f) => f.hora_inicio === 10);
      const f18 = res.franjas.find((f) => f.hora_inicio === 18);
      const f19 = res.franjas.find((f) => f.hora_inicio === 19);
      expect(f10?.estado).toBe('OCUPADA');
      expect(f18?.estado).toBe('LIBRE');
      expect(f18?.precio.monto_total).toBe(6800); // 8000 - 15%
      expect(f19?.estado).toBe('OCUPADA');
      expect(f19?.precio.monto_total).toBe(8400); // 8000 - 1200 + 1600
    });

    it('debería marcar franjas libres como MANTENIMIENTO cuando la cancha está inhabilitada', async () => {
      mockCanchasRepository.findById.mockResolvedValue(canchaMantenimiento);
      mockCanchasRepository.findReservasActivasByFecha.mockResolvedValue([{ hora_inicio: 18 }]);

      const res = await service.disponibilidad(3, '2026-12-01', 5, usuarioAdmin);

      expect(res.franjas.find((f) => f.hora_inicio === 18)?.estado).toBe('OCUPADA');
      expect(res.franjas.find((f) => f.hora_inicio === 19)?.estado).toBe('MANTENIMIENTO');
    });
  });

  // ── cancelar ───────────────────────────────────────────────────────────────

  describe('cancelar()', () => {
    const reservaBase = {
      id: 10,
      usuario_id: 5,
      cancha_id: 1,
      fecha: new Date('2026-12-10T00:00:00.000Z'),
      hora_inicio: 18,
      estado: 'CONFIRMADA' as const,
      monto_total: '10000.00',
    };

    it('debería cancelar SIN penalidad si faltan 24 h o más', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue(reservaBase);
      mockCanchasRepository.cancelarReserva.mockResolvedValue({ ...reservaBase, estado: 'CANCELADA' });

      const ahora = new Date(2026, 11, 9, 17, 0); // 25 h antes del turno
      const res = await service.cancelar(10, usuarioCliente, ahora);

      expect(res).toMatchObject({
        estado: 'CANCELADA',
        con_penalidad: false,
        penalidad: 0,
        monto_reembolsable: 10000,
      });
      expect(mockCanchasRepository.cancelarReserva).toHaveBeenCalledWith(10, 0);
    });

    it('debería cancelar CON penalidad del 50% si ya está CONFIRMADA y faltan menos de 24 h', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue(reservaBase);
      mockCanchasRepository.cancelarReserva.mockResolvedValue({ ...reservaBase, estado: 'CANCELADA' });

      const ahora = new Date(2026, 11, 10, 10, 0); // 8 h antes del turno
      const res = await service.cancelar(10, usuarioCliente, ahora);

      expect(res).toMatchObject({
        estado: 'CANCELADA',
        con_penalidad: true,
        penalidad: 5000,
        monto_reembolsable: 5000,
      });
      expect(mockCanchasRepository.cancelarReserva).toHaveBeenCalledWith(10, 5000);
    });

    it('debería cancelar SIN penalidad una reserva PENDIENTE_PAGO aunque falten menos de 24 h', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue({
        ...reservaBase,
        estado: 'PENDIENTE_PAGO',
      });
      mockCanchasRepository.cancelarReserva.mockResolvedValue({ ...reservaBase, estado: 'CANCELADA' });

      const ahora = new Date(2026, 11, 10, 15, 0); // 3 h antes
      const res = await service.cancelar(10, usuarioCliente, ahora);

      expect(res).toMatchObject({
        con_penalidad: false,
        penalidad: 0,
        monto_reembolsable: 0,
      });
    });

    it('debería rechazar cancelar una reserva ya CANCELADA o CUMPLIDA', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue({
        ...reservaBase,
        estado: 'CUMPLIDA',
      });
      await expect(service.cancelar(10, usuarioCliente)).rejects.toThrow(ConflictException);
    });

    it('debería impedir que un cliente cancele la reserva de otro usuario, pero permitirlo al personal', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue(reservaBase);
      mockCanchasRepository.cancelarReserva.mockResolvedValue({ ...reservaBase, estado: 'CANCELADA' });

      const otroCliente = { sub: 77, id_rol: 1 };
      const ahora = new Date(2026, 11, 8, 10, 0);

      await expect(service.cancelar(10, otroCliente, ahora)).rejects.toThrow(ForbiddenException);
      await expect(service.cancelar(10, usuarioAdmin, ahora)).resolves.toMatchObject({
        estado: 'CANCELADA',
      });
    });

    it('debería lanzar BadRequestException si el turno ya comenzó', async () => {
      mockCanchasRepository.findReservaById.mockResolvedValue(reservaBase);
      const despues = new Date(2026, 11, 10, 19, 0);

      await expect(service.cancelar(10, usuarioCliente, despues)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ── cambiarEstado (RF-12) ──────────────────────────────────────────────────

  describe('cambiarEstado()', () => {
    it('debería actualizar el estado de la cancha a EN_MANTENIMIENTO sin tocar reservas', async () => {
      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.updateEstado.mockResolvedValue(canchaMantenimiento);

      const res = await service.cambiarEstado(1, 'EN_MANTENIMIENTO', { sub: 1, id_rol: 4 });

      expect(res.estado).toBe('EN_MANTENIMIENTO');
      expect(mockCanchasRepository.updateEstado).toHaveBeenCalledWith(1, 'EN_MANTENIMIENTO');
    });

    it('debería lanzar NotFoundException si la cancha no existe', async () => {
      mockCanchasRepository.findById.mockResolvedValue(null);
      await expect(service.cambiarEstado(999, 'EN_MANTENIMIENTO', { sub: 1, id_rol: 4 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
