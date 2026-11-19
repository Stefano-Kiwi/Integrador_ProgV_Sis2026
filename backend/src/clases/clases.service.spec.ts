import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ClasesService } from './clases.service.js';
import { ClasesRepository } from './clases.repository.js';
import { CupoLiberadoSubject } from './observer/index.js';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockClasesRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  findEstadoMembresiaUsuario: vi.fn(),
  createReserva: vi.fn(),
  addToWaitlist: vi.fn(),
  findReservaById: vi.fn(),
  cancelarReservaYNotificar: vi.fn(),
  findListaEsperaByUsuario: vi.fn(),
};

const mockSubject = {
  notify: vi.fn(),
};

const ahoraBase = new Date('2026-12-01T12:00:00.000Z');
const horasDespues = (h: number) => new Date(ahoraBase.getTime() + h * 3_600_000);
const cliente = { sub: 10, id_rol: 1 };
const admin = { sub: 99, id_rol: 4 };

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('ClasesService', () => {
  let service: ClasesService;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockClasesRepository.findEstadoMembresiaUsuario.mockResolvedValue('ACTIVO');
    mockSubject.notify.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClasesService,
        { provide: ClasesRepository, useValue: mockClasesRepository },
        { provide: CupoLiberadoSubject, useValue: mockSubject },
      ],
    }).compile();

    service = module.get(ClasesService);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('debería devolver el listado de clases del repositorio', async () => {
      const clases = [{ id: 1, tipo_clase: { nombre: 'Spinning' } }];
      mockClasesRepository.findAll.mockResolvedValue(clases);

      const result = await service.findAll(admin);

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

  // ── reservar (RF-07, RF-08, RN-03) ─────────────────────────────────────────

  describe('reservar()', () => {
    it('debería confirmar la reserva cuando faltan <= 48 h, hay cupo y membresía ACTIVO', async () => {
      const clase = { id: 1, cupo_disponible: 5, inicio_at: horasDespues(24) };
      const reserva = { id: 101, clase_id: 1, usuario_id: 10, estado: 'CONFIRMADA' };

      mockClasesRepository.findById.mockResolvedValue(clase);
      mockClasesRepository.createReserva.mockResolvedValue(reserva);

      const result = await service.reservar({ clase_id: 1, usuario_id: 10 }, ahoraBase);

      expect(result.estado).toBe('CONFIRMADA');
      expect(result.reserva_id).toBe(101);
      expect(mockClasesRepository.createReserva).toHaveBeenCalledWith(1, 10);
      expect(mockClasesRepository.addToWaitlist).not.toHaveBeenCalled();
    });

    it('debería agregar a lista de espera cuando cupo_disponible es 0', async () => {
      const clase = { id: 2, cupo_disponible: 0, inicio_at: horasDespues(10) };
      const listaEntry = { id: 5, clase_id: 2, usuario_id: 10 };

      mockClasesRepository.findById.mockResolvedValue(clase);
      mockClasesRepository.addToWaitlist.mockResolvedValue({
        entry: listaEntry,
        position: 1,
      });

      const result = await service.reservar({ clase_id: 2, usuario_id: 10 }, ahoraBase);

      expect(result.estado).toBe('EN_ESPERA');
      expect(result.posicion).toBe(1);
      expect(result.lista_espera_id).toBe(5);
      expect(result.mensaje).toContain('Posición 1');
      expect(mockClasesRepository.createReserva).not.toHaveBeenCalled();
    });

    it('RF-07: debería rechazar si faltan más de 48 horas para la clase', async () => {
      const clase = { id: 1, cupo_disponible: 5, inicio_at: horasDespues(49) };
      mockClasesRepository.findById.mockResolvedValue(clase);

      await expect(
        service.reservar({ clase_id: 1, usuario_id: 10 }, ahoraBase),
      ).rejects.toThrow(BadRequestException);
    });

    it('RF-07: debería rechazar si la clase ya comenzó', async () => {
      const clase = { id: 1, cupo_disponible: 5, inicio_at: horasDespues(-1) };
      mockClasesRepository.findById.mockResolvedValue(clase);

      await expect(
        service.reservar({ clase_id: 1, usuario_id: 10 }, ahoraBase),
      ).rejects.toThrow(BadRequestException);
    });

    it.each(['VENCIDO', 'SUSPENDIDO'] as const)(
      'RN-03: debería rechazar con 403 si el socio tiene membresía %s',
      async (estado) => {
        const clase = { id: 1, cupo_disponible: 5, inicio_at: horasDespues(12) };
        mockClasesRepository.findById.mockResolvedValue(clase);
        mockClasesRepository.findEstadoMembresiaUsuario.mockResolvedValue(estado);

        await expect(
          service.reservar({ clase_id: 1, usuario_id: 10 }, ahoraBase),
        ).rejects.toThrow(ForbiddenException);
      },
    );

    it('RN-03: debería rechazar con 403 si el usuario no tiene membresía activa (cliente externo)', async () => {
      const clase = { id: 1, cupo_disponible: 5, inicio_at: horasDespues(12) };
      mockClasesRepository.findById.mockResolvedValue(clase);
      mockClasesRepository.findEstadoMembresiaUsuario.mockResolvedValue(null);

      await expect(
        service.reservar({ clase_id: 1, usuario_id: 10 }, ahoraBase),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debería lanzar NotFoundException si la clase no existe al reservar', async () => {
      mockClasesRepository.findById.mockResolvedValue(null);

      await expect(
        service.reservar({ clase_id: 999, usuario_id: 1 }, ahoraBase),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── cancelarReserva (RF-07, RF-08) ─────────────────────────────────────────

  describe('cancelarReserva()', () => {
    it('RF-07: debería cancelar SIN penalidad si faltan 2 horas o más y notificar al Observer', async () => {
      const reserva = {
        id: 20,
        usuario_id: 10,
        clase_id: 1,
        estado: 'CONFIRMADA',
        clase: { id: 1, inicio_at: horasDespues(3) },
      };
      const promocion = {
        listaEsperaId: 5,
        usuarioId: 11,
        reservaId: 99,
        claseId: 1,
        notificacion: 'Cupo asignado',
      };

      mockClasesRepository.findReservaById.mockResolvedValue(reserva);
      mockSubject.notify.mockResolvedValue([promocion]);
      mockClasesRepository.cancelarReservaYNotificar.mockImplementation(
        async (_id, _claseId, _pen, _ahora, cb) => ({
          reserva: { ...reserva, estado: 'CANCELADA' },
          resultadoObservers: await cb({} as never),
        }),
      );

      const res = await service.cancelarReserva(20, cliente, ahoraBase);

      expect(res).toMatchObject({
        reserva_id: 20,
        estado: 'CANCELADA',
        con_penalidad: false,
        promovido_desde_lista_espera: promocion,
      });
      expect(mockClasesRepository.cancelarReservaYNotificar).toHaveBeenCalledWith(
        20,
        1,
        false,
        ahoraBase,
        expect.any(Function),
      );
      expect(mockSubject.notify).toHaveBeenCalledWith(
        expect.objectContaining({ claseId: 1, reservaCanceladaId: 20 }),
      );
    });

    it('RF-07: debería cancelar CON penalidad si faltan menos de 2 horas', async () => {
      const reserva = {
        id: 21,
        usuario_id: 10,
        clase_id: 1,
        estado: 'CONFIRMADA',
        clase: { id: 1, inicio_at: horasDespues(1) },
      };

      mockClasesRepository.findReservaById.mockResolvedValue(reserva);
      mockClasesRepository.cancelarReservaYNotificar.mockResolvedValue({
        reserva: { ...reserva, estado: 'CANCELADA', con_penalidad: true },
        resultadoObservers: [],
      });

      const res = await service.cancelarReserva(21, cliente, ahoraBase);

      expect(res.con_penalidad).toBe(true);
      expect(mockClasesRepository.cancelarReservaYNotificar).toHaveBeenCalledWith(
        21,
        1,
        true,
        ahoraBase,
        expect.any(Function),
      );
    });

    it('debería rechazar si la clase ya comenzó', async () => {
      mockClasesRepository.findReservaById.mockResolvedValue({
        id: 22,
        usuario_id: 10,
        clase_id: 1,
        estado: 'CONFIRMADA',
        clase: { id: 1, inicio_at: horasDespues(-0.5) },
      });

      await expect(service.cancelarReserva(22, cliente, ahoraBase)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería rechazar si la reserva ya estaba cancelada', async () => {
      mockClasesRepository.findReservaById.mockResolvedValue({
        id: 23,
        usuario_id: 10,
        clase_id: 1,
        estado: 'CANCELADA',
        clase: { id: 1, inicio_at: horasDespues(5) },
      });

      await expect(service.cancelarReserva(23, cliente, ahoraBase)).rejects.toThrow(
        ConflictException,
      );
    });

    it('debería impedir que otro cliente cancele la reserva, pero permitirlo a personal', async () => {
      const reserva = {
        id: 24,
        usuario_id: 10,
        clase_id: 1,
        estado: 'CONFIRMADA',
        clase: { id: 1, inicio_at: horasDespues(5) },
      };
      mockClasesRepository.findReservaById.mockResolvedValue(reserva);
      mockClasesRepository.cancelarReservaYNotificar.mockResolvedValue({
        reserva: { ...reserva, estado: 'CANCELADA' },
        resultadoObservers: [],
      });

      await expect(
        service.cancelarReserva(24, { sub: 77, id_rol: 1 }, ahoraBase),
      ).rejects.toThrow(ForbiddenException);

      await expect(service.cancelarReserva(24, admin, ahoraBase)).resolves.toMatchObject({
        estado: 'CANCELADA',
      });
    });
  });

  // ── miListaEspera ──────────────────────────────────────────────────────────

  describe('miListaEspera()', () => {
    it('debería devolver las entradas en espera y posición del usuario', async () => {
      const espera = [{ lista_espera_id: 5, clase_id: 2, estado: 'EN_ESPERA', posicion: 2 }];
      mockClasesRepository.findListaEsperaByUsuario.mockResolvedValue(espera);

      const res = await service.miListaEspera(10);

      expect(res).toEqual(espera);
      expect(mockClasesRepository.findListaEsperaByUsuario).toHaveBeenCalledWith(10);
    });
  });
});
