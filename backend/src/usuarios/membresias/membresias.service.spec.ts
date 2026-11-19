import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MembresiasService } from './membresias.service.js';
import { MembresiasRepository } from './membresias.repository.js';
import { UsersService } from '../users.service.js';
import { UsersRepository } from '../users.repository.js';

const mockMembresiasRepo = {
  findPlanById: vi.fn(),
  findById: vi.fn(),
  findUltimaByUsuario: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  marcarVencidas: vi.fn(),
};

const mockUsersRepo = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const cliente = { sub: 3, id_rol: 1 };
const admin = { sub: 99, id_rol: 4 };
const ahora = new Date('2026-12-01T12:00:00.000Z');

describe('MembresiasService (RF-02) y UsersService (RF-01)', () => {
  let membresiasService: MembresiasService;
  let usersService: UsersService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembresiasService,
        UsersService,
        { provide: MembresiasRepository, useValue: mockMembresiasRepo },
        { provide: UsersRepository, useValue: mockUsersRepo },
      ],
    }).compile();

    membresiasService = module.get(MembresiasService);
    usersService = module.get(UsersService);
  });

  // ── RF-01: perfil y SOCIO vs CLIENTE_EXTERNO ───────────────────────────────

  describe('UsersService (RF-01)', () => {
    it('debería distinguir SOCIO (con membresía) de CLIENTE_EXTERNO (sin membresía)', async () => {
      mockUsersRepo.findAll.mockResolvedValue([
        { id: 3, nombre: 'Carlos', membresia: [{ id: 1, estado: 'ACTIVO', fecha_fin: ahora }] },
        { id: 6, nombre: 'Esteban', membresia: [] },
      ]);

      const lista = await usersService.findAll();
      expect(lista[0].tipo_usuario).toBe('SOCIO');
      expect(lista[1].tipo_usuario).toBe('CLIENTE_EXTERNO');
    });

    it('debería permitir actualizar el propio perfil y rechazar editar el de otro usuario', async () => {
      mockUsersRepo.findById.mockResolvedValue({ id: 3, nombre: 'Carlos', membresia: [] });
      mockUsersRepo.update.mockResolvedValue({
        id: 3,
        nombre: 'Carlos Editado',
        telefono: '3454000000',
        membresia: [],
      });

      const updated = await usersService.update(3, { nombre: 'Carlos Editado' }, cliente);
      expect(updated.nombre).toBe('Carlos Editado');

      await expect(
        usersService.update(3, { nombre: 'Hack' }, { sub: 8, id_rol: 1 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── RF-02: contratar, consultar, renovar, suspender, vencimientos ──────────

  describe('MembresiasService (RF-02)', () => {
    it('contratar(): crea membresía PENDIENTE_PAGO calculando fecha_fin según duración del plan', async () => {
      mockMembresiasRepo.findPlanById.mockResolvedValue({
        id: 2,
        nombre: 'Trimestral',
        duracion_meses: 3,
      });
      mockMembresiasRepo.create.mockImplementation(async (data) => ({ id: 15, ...data }));

      const res = await membresiasService.contratar(
        { plan_id: 2, renovacion_automatica: true },
        cliente,
        ahora,
      );

      expect(res.estado).toBe('PENDIENTE_PAGO');
      expect(res.fecha_fin.getUTCMonth()).toBe(2); // Marzo (Dic + 3 meses)
    });

    it('procesarVencimientos(): dispara transición ACTIVO → VENCIDO', async () => {
      mockMembresiasRepo.marcarVencidas.mockResolvedValue(4);

      const res = await membresiasService.procesarVencimientos(ahora);

      expect(res.vencidas_actualizadas).toBe(4);
      expect(mockMembresiasRepo.marcarVencidas).toHaveBeenCalledWith(ahora);
    });

    it('suspender(): permite ACTIVO → SUSPENDIDO y VENCIDO → SUSPENDIDO, pero rechaza si ya está SUSPENDIDO', async () => {
      mockMembresiasRepo.findById.mockResolvedValueOnce({ id: 1, estado: 'ACTIVO' });
      mockMembresiasRepo.update.mockResolvedValueOnce({ id: 1, estado: 'SUSPENDIDO' });
      expect((await membresiasService.suspender(1)).estado).toBe('SUSPENDIDO');

      mockMembresiasRepo.findById.mockResolvedValueOnce({ id: 2, estado: 'VENCIDO' });
      mockMembresiasRepo.update.mockResolvedValueOnce({ id: 2, estado: 'SUSPENDIDO' });
      expect((await membresiasService.suspender(2)).estado).toBe('SUSPENDIDO');

      mockMembresiasRepo.findById.mockResolvedValueOnce({ id: 3, estado: 'SUSPENDIDO' });
      await expect(membresiasService.suspender(3)).rejects.toThrow(ConflictException);
    });

    it('renovar(): reactiva membresía VENCIDA a ACTIVO con nueva fecha_fin', async () => {
      mockMembresiasRepo.findById.mockResolvedValue({
        id: 7,
        usuario_id: 3,
        plan_id: 1,
        estado: 'VENCIDO',
        fecha_inicio: new Date('2026-10-01'),
        fecha_fin: new Date('2026-11-01'),
      });
      mockMembresiasRepo.findPlanById.mockResolvedValue({
        id: 1,
        nombre: 'Mensual',
        duracion_meses: 1,
      });
      mockMembresiasRepo.update.mockImplementation(async (_id, data) => ({ id: 7, ...data }));

      const res = await membresiasService.renovar(7, {}, cliente, ahora);

      expect(res.estado).toBe('ACTIVO');
      expect(res.fecha_fin > ahora).toBe(true);
    });

    it('renovar(): permite al admin renovar y rechaza si otro cliente intenta renovar', async () => {
      mockMembresiasRepo.findById.mockResolvedValue({
        id: 7,
        usuario_id: 3,
        plan_id: 1,
        estado: 'SUSPENDIDO',
        fecha_inicio: ahora,
        fecha_fin: ahora,
      });
      mockMembresiasRepo.findPlanById.mockResolvedValue({ id: 1, duracion_meses: 1 });
      mockMembresiasRepo.update.mockResolvedValue({ id: 7, estado: 'ACTIVO' });

      await expect(
        membresiasService.renovar(7, {}, { sub: 88, id_rol: 1 }, ahora),
      ).rejects.toThrow(ForbiddenException);

      await expect(membresiasService.renovar(7, {}, admin, ahora)).resolves.toMatchObject({
        estado: 'ACTIVO',
      });
    });

    it('consultarEstado(): devuelve CLIENTE_EXTERNO si no tiene membresías y SOCIO si posee una', async () => {
      mockMembresiasRepo.findUltimaByUsuario.mockResolvedValueOnce(null);
      expect(await membresiasService.consultarEstado(6)).toMatchObject({
        tipo_usuario: 'CLIENTE_EXTERNO',
        estado: 'SIN_MEMBRESIA',
      });

      mockMembresiasRepo.findUltimaByUsuario.mockResolvedValueOnce({ id: 1, estado: 'VENCIDO' });
      expect(await membresiasService.consultarEstado(7)).toMatchObject({
        tipo_usuario: 'SOCIO',
        estado: 'VENCIDO',
      });
    });

    it('suspender(): lanza NotFoundException si la membresía no existe', async () => {
      mockMembresiasRepo.findById.mockResolvedValue(null);
      await expect(membresiasService.suspender(999)).rejects.toThrow(NotFoundException);
    });
  });
});
