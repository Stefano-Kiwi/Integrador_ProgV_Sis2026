import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CanchasService } from './canchas.service.js';
import { CanchasRepository } from './canchas.repository.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockCanchasRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  findReservaByTurno: vi.fn(),
  createReserva: vi.fn(),
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

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CanchasService', () => {
  let service: CanchasService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanchasService,
        { provide: CanchasRepository, useValue: mockCanchasRepository },
      ],
    }).compile();

    service = module.get(CanchasService);
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
    it('debería crear la reserva correctamente cuando el turno está libre', async () => {
      const reservaCreada = {
        id: 55,
        cancha_id: 1,
        usuario_id: 5,
        estado: 'PENDIENTE_PAGO',
        precio_base: '8000.00',
        monto_total: '8000.00',
      };

      mockCanchasRepository.findById.mockResolvedValue(canchaHabilitada);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null); // turno libre
      mockCanchasRepository.createReserva.mockResolvedValue(reservaCreada);

      const result = await service.reservar(dtoReserva);

      expect(result.estado).toBe('PENDIENTE_PAGO');
      expect(result.reserva_id).toBe(55);
      expect(mockCanchasRepository.createReserva).toHaveBeenCalledWith(
        expect.objectContaining({
          cancha_id: 1,
          usuario_id: 5,
          hora_inicio: 18,
          precio_base: 8000,
          monto_total: 8000,
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
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(reservaExistente); // turno ocupado

      await expect(service.reservar(dtoReserva)).rejects.toThrow(ConflictException);
      await expect(service.reservar(dtoReserva)).rejects.toThrow('reservado');
    });

    it('debería lanzar NotFoundException si la cancha no existe', async () => {
      mockCanchasRepository.findById.mockResolvedValue(null);

      await expect(service.reservar(dtoReserva)).rejects.toThrow(NotFoundException);
    });

    it('debería calcular el monto_total igual al costo_hora de la cancha', async () => {
      const reservaCreada = {
        id: 56, cancha_id: 1, usuario_id: 5,
        estado: 'PENDIENTE_PAGO', precio_base: '15000.00', monto_total: '15000.00',
      };
      const canchaFutbol = { ...canchaHabilitada, costo_hora: '15000.00' };

      mockCanchasRepository.findById.mockResolvedValue(canchaFutbol);
      mockCanchasRepository.findReservaByTurno.mockResolvedValue(null);
      mockCanchasRepository.createReserva.mockResolvedValue(reservaCreada);

      await service.reservar(dtoReserva);

      expect(mockCanchasRepository.createReserva).toHaveBeenCalledWith(
        expect.objectContaining({ precio_base: 15000, monto_total: 15000 }),
      );
    });
  });
});

