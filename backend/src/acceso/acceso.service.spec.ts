import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccesoService } from './acceso.service.js';
import { AccesoRepository } from './acceso.repository.js';

const mockRepo = {
  tieneMembresiaActiva: vi.fn(),
  findSedeById: vi.fn(),
  findAccesoActivo: vi.fn(),
  findAccesoPorClaveOffline: vi.fn(),
  createIngreso: vi.fn(),
  registrarEgreso: vi.fn(),
  contarAforoActual: vi.fn(),
  findSociosActivosSnapshot: vi.fn(),
};

const sedeEjemplo = { id: 2, nombre: 'FitZone Costanera', aforo_maximo: 120 };
const t0 = new Date('2026-12-01T15:00:10.000Z'); // ventana 15:00:00..15:01:00

describe('AccesoService', () => {
  let service: AccesoService;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockRepo.tieneMembresiaActiva.mockResolvedValue(true);
    mockRepo.findSedeById.mockResolvedValue(sedeEjemplo);
    mockRepo.findAccesoActivo.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccesoService,
        { provide: AccesoRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(AccesoService);
  });

  // ── generarQr (RF-04) ──────────────────────────────────────────────────────

  describe('generarQr()', () => {
    it('debería emitir un QR firmado válido por 60 s y rotarlo al minuto siguiente', async () => {
      const qr1 = await service.generarQr(3, t0);
      const qr2 = await service.generarQr(3, new Date('2026-12-01T15:01:05.000Z'));

      expect(qr1.validez_segundos).toBe(60);
      expect(qr1.userId).toBe(3);
      expect(qr1.qr).not.toBe(qr2.qr);
    });

    it('debería rechazar con 403 si el socio está en mora / sin membresía activa', async () => {
      mockRepo.tieneMembresiaActiva.mockResolvedValue(false);

      await expect(service.generarQr(7, t0)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── validarIngreso (RF-03, RF-04, RN-01) ───────────────────────────────────

  describe('validarIngreso()', () => {
    it('QR válido: debería autorizar y registrar ingreso en cualquier sede (multi-sede)', async () => {
      const { qr } = await service.generarQr(3, t0);
      const tDentroVentana = new Date('2026-12-01T15:00:45.000Z');
      mockRepo.createIngreso.mockResolvedValue({
        id: 50,
        usuario_id: 3,
        sede_id: 2,
        ingreso_at: tDentroVentana,
      });

      const res = await service.validarIngreso({ qr, sedeId: 2 }, tDentroVentana);

      expect(res).toMatchObject({
        autorizado: true,
        acceso_id: 50,
        usuario_id: 3,
        sede_id: 2,
      });
      expect(mockRepo.createIngreso).toHaveBeenCalledWith(3, 2, tDentroVentana);
    });

    it('QR vencido: debería rechazar con 401 pasados los 60 segundos', async () => {
      const { qr } = await service.generarQr(3, t0);
      const tVencido = new Date('2026-12-01T15:01:05.000Z');

      await expect(service.validarIngreso({ qr, sedeId: 2 }, tVencido)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Firma inválida: debería rechazar con 401 si el token fue alterado', async () => {
      const { qr } = await service.generarQr(3, t0);
      const [body, sig] = qr.split('.');
      const alterado = `${body}.${sig.slice(0, -1)}${sig.endsWith('a') ? 'b' : 'a'}`;

      await expect(service.validarIngreso({ qr: alterado, sedeId: 2 }, t0)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Socio en mora: debería rechazar con 403 al validar ingreso', async () => {
      const { qr } = await service.generarQr(3, t0);
      mockRepo.tieneMembresiaActiva.mockResolvedValue(false);

      await expect(service.validarIngreso({ qr, sedeId: 2 }, t0)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('RN-01 (doble sede simultánea): debería rechazar con 409 si ya tiene un ingreso abierto', async () => {
      const { qr } = await service.generarQr(3, t0);
      mockRepo.findAccesoActivo.mockResolvedValue({ id: 10, usuario_id: 3, sede_id: 1, egreso_at: null });

      await expect(service.validarIngreso({ qr, sedeId: 2 }, t0)).rejects.toThrow(
        ConflictException,
      );
    });

    it('RN-01 (concurrencia): debería traducir P2002 de ux_acceso_activo_por_usuario a 409', async () => {
      const { qr } = await service.generarQr(3, t0);
      const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.22.0',
      });
      mockRepo.createIngreso.mockRejectedValue(p2002);

      await expect(service.validarIngreso({ qr, sedeId: 2 }, t0)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ── registrarEgreso & obtenerAforo (RF-05) ─────────────────────────────────

  describe('registrarEgreso() y obtenerAforo()', () => {
    it('debería cerrar el acceso abierto del socio', async () => {
      const salida = new Date('2026-12-01T16:30:00.000Z');
      mockRepo.findAccesoActivo.mockResolvedValue({ id: 50, usuario_id: 3, sede_id: 2, ingreso_at: t0 });
      mockRepo.registrarEgreso.mockResolvedValue({
        id: 50,
        usuario_id: 3,
        sede_id: 2,
        ingreso_at: t0,
        egreso_at: salida,
      });

      const res = await service.registrarEgreso(3, salida);

      expect(res.egreso_at).toEqual(salida);
      expect(mockRepo.registrarEgreso).toHaveBeenCalledWith(50, salida);
    });

    it('debería lanzar NotFoundException si no tiene acceso abierto', async () => {
      mockRepo.findAccesoActivo.mockResolvedValue(null);
      await expect(service.registrarEgreso(3)).rejects.toThrow(NotFoundException);
    });

    it('RF-05: debería devolver ocupación actual y aforo máximo de la sede', async () => {
      mockRepo.contarAforoActual.mockResolvedValue(30);

      const res = await service.obtenerAforo(2);

      expect(res).toEqual({
        sede_id: 2,
        sede_nombre: 'FitZone Costanera',
        aforo_actual: 30,
        aforo_maximo: 120,
        porcentaje_ocupacion: 25,
      });
    });
  });

  // ── sincronizarOffline & obtenerSnapshotSede (RNF-01) ──────────────────────

  describe('sincronizarOffline() y obtenerSnapshotSede()', () => {
    it('RNF-01: sincronización idempotente no duplica al reenviar y reporta conflictos', async () => {
      const { qr: qrSocio3 } = await service.generarQr(3, t0);
      const { qr: qrSocio4 } = await service.generarQr(4, t0);
      const ts = '2026-12-01T15:00:20.000Z';

      // Simulamos BD en memoria para verificar idempotencia real al reenviar el mismo lote
      const registrados = new Map<string, { id: number; usuario_id: number; sede_id: number; ingreso_at: Date }>();
      let nextId = 100;

      mockRepo.findAccesoPorClaveOffline.mockImplementation(async (u: number, s: number, d: Date) => {
        return registrados.get(`${u}:${s}:${d.toISOString()}`) ?? null;
      });
      mockRepo.createIngreso.mockImplementation(async (u: number, s: number, d: Date) => {
        if (u === 4) {
          throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: '5.22.0',
          });
        }
        const rec = { id: nextId++, usuario_id: u, sede_id: s, ingreso_at: d };
        registrados.set(`${u}:${s}:${d.toISOString()}`, rec);
        return rec;
      });

      const lote = {
        ingresos: [
          { userId: 3, sedeId: 2, timestamp: ts, qrToken: qrSocio3 }, // válido -> se inserta
          { userId: 4, sedeId: 2, timestamp: ts, qrToken: qrSocio4 }, // conflicto RN-01 (P2002)
          { userId: 5, sedeId: 2, timestamp: ts, qrToken: 'invalido.firma' }, // conflicto firma
        ],
      };

      // Primer envío
      const res1 = await service.sincronizarOffline(lote);
      expect(res1.aceptados).toHaveLength(1);
      expect(res1.aceptados[0]).toMatchObject({ userId: 3, duplicado: false, acceso_id: 100 });
      expect(res1.conflictos).toHaveLength(2);

      // Reenvío del mismo evento del socio 3 -> idempotente (NO crea nuevo registro)
      const res2 = await service.sincronizarOffline({ ingresos: [lote.ingresos[0]] });
      expect(res2.aceptados).toHaveLength(1);
      expect(res2.aceptados[0]).toMatchObject({ userId: 3, duplicado: true, acceso_id: 100 });
      expect(registrados.size).toBe(1);
    });

    it('RNF-01: debería devolver el snapshot de socios activos para validación offline', async () => {
      mockRepo.findSociosActivosSnapshot.mockResolvedValue([
        {
          estado: 'ACTIVO',
          fecha_fin: new Date('2026-12-31'),
          usuario: { id: 3, dni: '30000003', nombre: 'Carlos', apellido: 'Gómez' },
        },
      ]);

      const snap = await service.obtenerSnapshotSede(2);

      expect(snap.sede_id).toBe(2);
      expect(snap.total_socios_activos).toBe(1);
      expect(snap.socios[0]).toMatchObject({ userId: 3, dni: '30000003', membresia_estado: 'ACTIVO' });
    });
  });
});
