import type { Prisma } from '@prisma/client';

/** Evento emitido cuando se libera un cupo en una clase (por ejemplo, tras una cancelación). */
export interface CupoLiberadoEvento {
  claseId: number;
  reservaCanceladaId: number;
  /** Cliente transaccional de Prisma para que la promoción ocurra en la misma transacción. */
  tx: Prisma.TransactionClient;
}

/** Resultado de promover a un usuario desde la lista de espera. */
export interface PromocionListaEspera {
  listaEsperaId: number;
  usuarioId: number;
  reservaId: number;
  claseId: number;
  notificacion: string;
}

/** Interfaz Observer (RF-08). */
export interface CupoLiberadoObserver {
  update(evento: CupoLiberadoEvento): Promise<PromocionListaEspera | void>;
}
