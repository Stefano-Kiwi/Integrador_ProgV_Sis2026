import { Injectable, Logger } from '@nestjs/common';

export interface NotificacionSimulada {
  usuarioId: number;
  claseId: number;
  mensaje: string;
  enviadaAt: Date;
}

/** Servicio de notificaciones simulado (RF-08): registra en log y mantiene historial en memoria. */
@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);
  private readonly historial: NotificacionSimulada[] = [];

  notificarCupoAsignado(usuarioId: number, claseId: number, reservaId: number): NotificacionSimulada {
    const mensaje = `Se liberó un cupo en la clase #${claseId}. Tu lugar en lista de espera fue promovido a reserva confirmada (#${reservaId}).`;
    const registro: NotificacionSimulada = {
      usuarioId,
      claseId,
      mensaje,
      enviadaAt: new Date(),
    };
    this.historial.push(registro);
    this.logger.log(`[NOTIFICACION -> Usuario #${usuarioId}] ${mensaje}`);
    return registro;
  }

  getHistorial(): readonly NotificacionSimulada[] {
    return this.historial;
  }
}
