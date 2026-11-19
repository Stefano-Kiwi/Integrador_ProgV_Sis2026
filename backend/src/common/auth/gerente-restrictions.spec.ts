import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SedesService } from '../../sedes/sedes.service.js';
import { ClasesService } from '../../clases/clases.service.js';
import { CanchasService } from '../../canchas/canchas.service.js';
import { ClasesController } from '../../clases/clases.controller.js';
import { CanchasController } from '../../canchas/canchas.controller.js';
import { SedesController } from '../../sedes/sedes.controller.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { PRICING_STRATEGY_CLASSES, PricingService } from '../../canchas/pricing/index.js';
import type { JwtPayload } from '../decorators/current-user.decorator.js';

const gerenteSede1: JwtPayload = { sub: 1, id_rol: 3, clase_rol: 'Gerente', sede_base_id: 1 };
const gerenteSinSede: JwtPayload = { sub: 2, id_rol: 3, clase_rol: 'Gerente', sede_base_id: null };
const administrador: JwtPayload = { sub: 5, id_rol: 4, clase_rol: 'Administrador', sede_base_id: 1 };

describe('Restricciones de acceso para Gerente vs Administrador', () => {
  const mockSedesRepo = { findAll: vi.fn(), findById: vi.fn(), create: vi.fn() };
  const mockClasesRepo = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  const mockCanchasRepo = {
    findAll: vi.fn(),
    findAllReservas: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateEstado: vi.fn(),
    remove: vi.fn(),
    findReservasActivasByFecha: vi.fn(),
    usuarioEsSocioActivo: vi.fn(),
  };

  let sedesService: SedesService;
  let clasesService: ClasesService;
  let canchasService: CanchasService;

  beforeEach(() => {
    vi.clearAllMocks();
    sedesService = new SedesService(mockSedesRepo as never);
    clasesService = new ClasesService(mockClasesRepo as never, { notify: vi.fn() } as never);
    const pricing = new PricingService(PRICING_STRATEGY_CLASSES.map((C) => new C()));
    canchasService = new CanchasService(mockCanchasRepo as never, pricing);
  });

  // ── 1. Restricción por sede ────────────────────────────────────────────────

  describe('Restricción por sede', () => {
    it('Gerente solo recibe su sede al listar y 403 al consultar otra sede', async () => {
      mockSedesRepo.findById.mockResolvedValue({ id: 1, nombre: 'Sede 1' });

      const propias = await sedesService.findAll(gerenteSede1);
      expect(propias).toEqual([{ id: 1, nombre: 'Sede 1' }]);
      expect(mockSedesRepo.findById).toHaveBeenCalledWith(1);

      await expect(sedesService.findById(2, gerenteSede1)).rejects.toThrow(ForbiddenException);
      await expect(sedesService.findAll(gerenteSinSede)).rejects.toThrow(ForbiddenException);
    });

    it('Administrador puede listar todas las sedes y consultar cualquiera', async () => {
      mockSedesRepo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      mockSedesRepo.findById.mockResolvedValue({ id: 2, nombre: 'Sede 2' });

      expect(await sedesService.findAll(administrador)).toHaveLength(2);
      expect(await sedesService.findById(2, administrador)).toMatchObject({ id: 2 });
    });
  });

  // ── 2. Clases grupales ─────────────────────────────────────────────────────

  describe('Clases grupales', () => {
    it('Gerente filtra listado a su sede, crea/edita solo en su sede y recibe 403 en otra sede', async () => {
      mockClasesRepo.findAll.mockResolvedValue([{ id: 10, sede_id: 1 }]);
      await clasesService.findAll(gerenteSede1);
      expect(mockClasesRepo.findAll).toHaveBeenCalledWith(1);

      // Crear en su sede -> permitido
      mockClasesRepo.create.mockResolvedValue({ id: 11, sede_id: 1 });
      await expect(
        clasesService.create({ sede_id: 1, tipo_clase_id: 1, instructor_id: 1, inicio_at: '', fin_at: '', capacidad_maxima: 15 }, gerenteSede1),
      ).resolves.toMatchObject({ id: 11 });

      // Crear intentando otra sede -> 403
      await expect(
        clasesService.create({ sede_id: 2, tipo_clase_id: 1, instructor_id: 1, inicio_at: '', fin_at: '', capacidad_maxima: 15 }, gerenteSede1),
      ).rejects.toThrow(ForbiddenException);

      // Consultar o editar clase de otra sede -> 403
      mockClasesRepo.findById.mockResolvedValueOnce({ id: 20, sede_id: 2 });
      await expect(clasesService.findById(20, gerenteSede1)).rejects.toThrow(ForbiddenException);

      mockClasesRepo.findById.mockResolvedValueOnce({ id: 20, sede_id: 2 });
      await expect(clasesService.update(20, { capacidad_maxima: 30 }, gerenteSede1)).rejects.toThrow(ForbiddenException);

      // Editar clase propia -> permitido
      mockClasesRepo.findById.mockResolvedValueOnce({ id: 10, sede_id: 1 });
      mockClasesRepo.update.mockResolvedValueOnce({ id: 10, sede_id: 1, capacidad_maxima: 30 });
      await expect(clasesService.update(10, { capacidad_maxima: 30 }, gerenteSede1)).resolves.toMatchObject({
        capacidad_maxima: 30,
      });
    });

    it('DELETE /clases/:id está restringido exclusivamente a Administrador (403 para Gerente)', () => {
      const roles = Reflect.getMetadata(ROLES_KEY, ClasesController.prototype.remove);
      expect(roles).toEqual(['Administrador']);

      const reflector = new Reflector();
      const guard = new RolesGuard(reflector);
      const makeCtx = (user: JwtPayload) =>
        ({
          getHandler: () => ClasesController.prototype.remove,
          getClass: () => ClasesController,
          switchToHttp: () => ({ getRequest: () => ({ user }) }),
        }) as never;

      expect(() => guard.canActivate(makeCtx(gerenteSede1))).toThrow(ForbiddenException);
      expect(guard.canActivate(makeCtx(administrador))).toBe(true);
    });
  });

  // ── 3. Canchas deportivas ──────────────────────────────────────────────────

  describe('Canchas deportivas', () => {
    it('Gerente solo opera sobre canchas de su sede y recibe 403 sobre otra sede', async () => {
      mockCanchasRepo.findAll.mockResolvedValue([{ id: 1, sede_id: 1 }]);
      await canchasService.findAll(gerenteSede1);
      expect(mockCanchasRepo.findAll).toHaveBeenCalledWith(1);

      mockCanchasRepo.findAllReservas.mockResolvedValue([]);
      await canchasService.findAllReservas(gerenteSede1);
      expect(mockCanchasRepo.findAllReservas).toHaveBeenCalledWith(1);

      // Crear en otra sede -> 403
      await expect(
        canchasService.create({ sede_id: 2, tipo_cancha_id: 1, nombre: 'P2', costo_hora: 9000 }, gerenteSede1),
      ).rejects.toThrow(ForbiddenException);

      // Editar o cambiar estado en otra sede -> 403
      mockCanchasRepo.findById.mockResolvedValueOnce({ id: 5, sede_id: 2 });
      await expect(canchasService.update(5, { costo_hora: 12000 }, gerenteSede1)).rejects.toThrow(ForbiddenException);

      mockCanchasRepo.findById.mockResolvedValueOnce({ id: 5, sede_id: 2 });
      await expect(canchasService.cambiarEstado(5, 'EN_MANTENIMIENTO', gerenteSede1)).rejects.toThrow(ForbiddenException);

      // Editar cancha propia -> permitido
      mockCanchasRepo.findById.mockResolvedValueOnce({ id: 1, sede_id: 1 });
      mockCanchasRepo.update.mockResolvedValueOnce({ id: 1, sede_id: 1, costo_hora: 9500 });
      await expect(canchasService.update(1, { costo_hora: 9500 }, gerenteSede1)).resolves.toMatchObject({
        costo_hora: 9500,
      });
    });

    it('DELETE /canchas/:id y POST /sedes están restringidos exclusivamente a Administrador (403 para Gerente)', () => {
      expect(Reflect.getMetadata(ROLES_KEY, CanchasController.prototype.remove)).toEqual(['Administrador']);
      expect(Reflect.getMetadata(ROLES_KEY, SedesController.prototype.create)).toEqual(['Administrador']);

      const guard = new RolesGuard(new Reflector());
      const ctxDeleteCancha = (user: JwtPayload) =>
        ({
          getHandler: () => CanchasController.prototype.remove,
          getClass: () => CanchasController,
          switchToHttp: () => ({ getRequest: () => ({ user }) }),
        }) as never;

      expect(() => guard.canActivate(ctxDeleteCancha(gerenteSede1))).toThrow(ForbiddenException);
      expect(guard.canActivate(ctxDeleteCancha(administrador))).toBe(true);
    });
  });
});
