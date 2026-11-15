import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClasesService } from './clases.service.js';
import { ClasesRepository } from './clases.repository.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockClasesRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  createReserva: vi.fn(),
  addToWaitlist: vi.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('ClasesService', () => {
  let service: ClasesService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClasesService,
        { provide: ClasesRepository, useValue: mockClasesRepository },
      ],
    }).compile();

    service = module.get(ClasesService);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('debería devolver el listado de clases del repositorio', async () => {
      const clases = [{ id: 1, tipo_clase: { nombre: 'Spinning' } }];
      mockClasesRepository.findAll.mockResolvedValue(clases);

      const result = await service.findAll();

      expect(result).toEqual(clases);
      expect(mockClasesRepository.findAll).toHaveBeenCalledOnce();
    });
  });

  // ── findById ───────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('debería devolver la clase cuando existe', async () => {
      const clase = { id: 1, cupo_disponible: 5 };
      mockClasesRepository.findById.mockResolvedValue(clase);

      const result = await service.findById(1);

      expect(result).toEqual(clase);
    });

    it('debería lanzar NotFoundException cuando la clase no existe', async () => {
      mockClasesRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow('999');
    });
  });

  // ── reservar ───────────────────────────────────────────────────────────────

  describe('reservar()', () => {
    it('debería confirmar la reserva cuando hay cupo disponible', async () => {
      const clase = { id: 1, cupo_disponible: 5 };
      const reserva = { id: 101, clase_id: 1, usuario_id: 10, estado: 'CONFIRMADA' };

      mockClasesRepository.findById.mockResolvedValue(clase);
      mockClasesRepository.createReserva.mockResolvedValue(reserva);

      const result = await service.reservar({ clase_id: 1, usuario_id: 10 });

      expect(result.estado).toBe('CONFIRMADA');
      expect(result.reserva_id).toBe(101);
      expect(mockClasesRepository.createReserva).toHaveBeenCalledWith(1, 10);
      expect(mockClasesRepository.addToWaitlist).not.toHaveBeenCalled();
    });

    it('debería agregar a lista de espera cuando cupo_disponible es 0', async () => {
      const clase = { id: 2, cupo_disponible: 0 };
      const listaEntry = { id: 5, clase_id: 2, usuario_id: 10 };

      mockClasesRepository.findById.mockResolvedValue(clase);
      mockClasesRepository.addToWaitlist.mockResolvedValue({
        entry: listaEntry,
        position: 1,
      });

      const result = await service.reservar({ clase_id: 2, usuario_id: 10 });

      expect(result.estado).toBe('EN_ESPERA');
      expect(result.posicion).toBe(1);
      expect(result.lista_espera_id).toBe(5);
      expect(result.mensaje).toContain('Posición 1');
      expect(mockClasesRepository.createReserva).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la clase no existe al reservar', async () => {
      mockClasesRepository.findById.mockResolvedValue(null);

      await expect(
        service.reservar({ clase_id: 999, usuario_id: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

