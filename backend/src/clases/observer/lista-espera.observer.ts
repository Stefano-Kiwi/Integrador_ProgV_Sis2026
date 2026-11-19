import { Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CupoLiberadoEvento,
  CupoLiberadoObserver,
  PromocionListaEspera,
} from './cupo-liberado.interface.js';
import { CupoLiberadoSubject } from './cupo-liberado.subject.js';
import { NotificacionesService } from './notificaciones.service.js';

/**
 * Observer concreto (RF-08): al liberarse un cupo, promueve en orden FIFO al primer socio
 * de `lista_espera_clase` a una reserva confirmada y emite la notificación simulada,
 * todo dentro de la misma transacción de Prisma.
 */
@Injectable()
export class ListaEsperaObserver implements CupoLiberadoObserver, OnModuleInit {
  constructor(
    private readonly subject: CupoLiberadoSubject,
    private readonly notificaciones: NotificacionesService,
  ) {}

  onModuleInit(): void {
    this.subject.subscribe(this);
  }

  async update(evento: CupoLiberadoEvento): Promise<PromocionListaEspera | void> {
    const { claseId, tx } = evento;

    const siguiente = await tx.lista_espera_clase.findFirst({
      where: { clase_id: claseId, estado: 'EN_ESPERA' },
      orderBy: [{ creada_at: 'asc' }, { id: 'asc' }],
    });

    if (!siguiente) {
      return;
    }

    await tx.clase.update({
      where: { id: claseId },
      data: { cupo_disponible: { decrement: 1 } },
    });

    const reserva = await tx.reserva_clase.create({
      data: {
        clase_id: claseId,
        usuario_id: siguiente.usuario_id,
        estado: 'CONFIRMADA',
      },
    });

    await tx.lista_espera_clase.update({
      where: { id: siguiente.id },
      data: {
        estado: 'CONVERTIDO',
        notificada_at: new Date(),
      },
    });

    const notif = this.notificaciones.notificarCupoAsignado(
      siguiente.usuario_id,
      claseId,
      reserva.id,
    );

    return {
      listaEsperaId: siguiente.id,
      usuarioId: siguiente.usuario_id,
      reservaId: reserva.id,
      claseId,
      notificacion: notif.mensaje,
    };
  }
}
