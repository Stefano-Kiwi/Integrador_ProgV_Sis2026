import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Prisma } from '@prisma/client';
import { CupoLiberadoSubject } from './cupo-liberado.subject.js';
import { ListaEsperaObserver } from './lista-espera.observer.js';
import { NotificacionesService } from './notificaciones.service.js';

describe('Patrón Observer — ListaEsperaObserver & CupoLiberadoSubject (RF-08)', () => {
  let subject: CupoLiberadoSubject;
  let notificaciones: NotificacionesService;
  let observer: ListaEsperaObserver;

  beforeEach(() => {
    subject = new CupoLiberadoSubject();
    notificaciones = new NotificacionesService();
    observer = new ListaEsperaObserver(subject, notificaciones);
    observer.onModuleInit();
  });

  it('debería promover en orden FIFO al primer usuario en espera y emitir notificación', async () => {
    // Simulamos una cola FIFO en memoria (2 usuarios esperando)
    const cola = [
      { id: 10, clase_id: 2, usuario_id: 101, estado: 'EN_ESPERA', creada_at: new Date('2026-12-01T10:00:00Z') },
      { id: 11, clase_id: 2, usuario_id: 102, estado: 'EN_ESPERA', creada_at: new Date('2026-12-01T10:05:00Z') },
    ];
    let nextReservaId = 500;

    const tx = {
      lista_espera_clase: {
        findFirst: vi.fn(async () => cola.find((e) => e.estado === 'EN_ESPERA') ?? null),
        update: vi.fn(async ({ where, data }: { where: { id: number }; data: { estado: string } }) => {
          const item = cola.find((e) => e.id === where.id)!;
          item.estado = data.estado;
          return item;
        }),
      },
      clase: {
        update: vi.fn(async () => ({ id: 2, cupo_disponible: 0 })),
      },
      reserva_clase: {
        create: vi.fn(async ({ data }: { data: { clase_id: number; usuario_id: number } }) => ({
          id: nextReservaId++,
          ...data,
          estado: 'CONFIRMADA',
        })),
      },
    } as unknown as Prisma.TransactionClient;

    // 1er cupo liberado -> promueve al usuario 101 (primero en llegar)
    const res1 = await subject.notify({ claseId: 2, reservaCanceladaId: 1, tx });
    expect(res1).toHaveLength(1);
    expect(res1[0]).toMatchObject({
      listaEsperaId: 10,
      usuarioId: 101,
      reservaId: 500,
      claseId: 2,
    });
    expect(tx.lista_espera_clase.findFirst).toHaveBeenCalledWith({
      where: { clase_id: 2, estado: 'EN_ESPERA' },
      orderBy: [{ creada_at: 'asc' }, { id: 'asc' }],
    });
    expect(tx.clase.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { cupo_disponible: { decrement: 1 } },
    });

    // 2do cupo liberado -> promueve al usuario 102 (segundo en llegar)
    const res2 = await subject.notify({ claseId: 2, reservaCanceladaId: 2, tx });
    expect(res2).toHaveLength(1);
    expect(res2[0]).toMatchObject({
      listaEsperaId: 11,
      usuarioId: 102,
      reservaId: 501,
      claseId: 2,
    });

    // Notificaciones emitidas en orden FIFO
    const historial = notificaciones.getHistorial();
    expect(historial).toHaveLength(2);
    expect(historial[0].usuarioId).toBe(101);
    expect(historial[1].usuarioId).toBe(102);
  });

  it('no debería crear reserva ni notificar si la lista de espera está vacía', async () => {
    const tx = {
      lista_espera_clase: { findFirst: vi.fn().mockResolvedValue(null), update: vi.fn() },
      clase: { update: vi.fn() },
      reserva_clase: { create: vi.fn() },
    } as unknown as Prisma.TransactionClient;

    const res = await subject.notify({ claseId: 2, reservaCanceladaId: 9, tx });

    expect(res).toEqual([]);
    expect(tx.reserva_clase.create).not.toHaveBeenCalled();
    expect(tx.clase.update).not.toHaveBeenCalled();
    expect(notificaciones.getHistorial()).toHaveLength(0);
  });
});
