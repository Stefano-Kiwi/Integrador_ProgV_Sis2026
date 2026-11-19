import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { SedesService } from '../sedes/sedes.service.js';
import { PlanesService } from '../planes/planes.service.js';
import { RolesGuard } from './guards/roles.guard.js';

describe('SedesService, PlanesService y RolesGuard', () => {
  const mockSedesRepo = { findAll: vi.fn(), findById: vi.fn(), findByIds: vi.fn(), findSedeBaseId: vi.fn(), create: vi.fn() };
  const mockPlanesRepo = { findAll: vi.fn(), findById: vi.fn(), create: vi.fn() };
  let sedesService: SedesService;
  let planesService: PlanesService;

  beforeEach(() => {
    vi.clearAllMocks();
    sedesService = new SedesService(mockSedesRepo as never);
    planesService = new PlanesService(mockPlanesRepo as never);
  });

  it('SedesService: lista, busca, crea y traduce P2002 a 409', async () => {
    mockSedesRepo.findAll.mockResolvedValue([{ id: 1, nombre: 'Centro' }]);
    expect(await sedesService.findAll({ sub: 1, id_rol: 4 })).toHaveLength(1);

    mockSedesRepo.findById.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null);
    expect(await sedesService.findById(1)).toEqual({ id: 1 });
    await expect(sedesService.findById(99)).rejects.toThrow(NotFoundException);

    mockSedesRepo.create.mockResolvedValueOnce({ id: 27, nombre: 'Nueva Sede' });
    expect(await sedesService.create({ nombre: 'Nueva Sede' } as never)).toMatchObject({ id: 27 });

    const p2002 = new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: '5.22.0' });
    mockSedesRepo.create.mockRejectedValueOnce(p2002);
    await expect(sedesService.create({ nombre: 'Centro' } as never)).rejects.toThrow(ConflictException);
  });

  it('PlanesService: lista, busca, crea y traduce P2002 a 409', async () => {
    mockPlanesRepo.findAll.mockResolvedValue([{ id: 1, nombre: 'Mensual' }]);
    expect(await planesService.findAll()).toHaveLength(1);

    mockPlanesRepo.findById.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null);
    expect(await planesService.findById(1)).toEqual({ id: 1 });
    await expect(planesService.findById(99)).rejects.toThrow(NotFoundException);

    mockPlanesRepo.create.mockResolvedValueOnce({ id: 4, nombre: 'Semestral' });
    expect(await planesService.create({ nombre: 'Semestral' } as never)).toMatchObject({ id: 4 });

    const p2002 = new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: '5.22.0' });
    mockPlanesRepo.create.mockRejectedValueOnce(p2002);
    await expect(planesService.create({ nombre: 'Mensual' } as never)).rejects.toThrow(ConflictException);
  });

  it('RolesGuard: permite sin @Roles, autoriza rol válido y rechaza 403 en caso contrario', () => {
    const reflector = { getAllAndOverride: vi.fn() } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const makeCtx = (user?: { sub: number; id_rol: number }) =>
      ({
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
      }) as never;

    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined);
    expect(guard.canActivate(makeCtx())).toBe(true);

    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Gerente']);
    expect(guard.canActivate(makeCtx({ sub: 1, id_rol: 3 }))).toBe(true);

    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Gerente']);
    expect(() => guard.canActivate(makeCtx({ sub: 2, id_rol: 1 }))).toThrow(ForbiddenException);

    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['Gerente']);
    expect(() => guard.canActivate(makeCtx(undefined))).toThrow(ForbiddenException);
  });
});
