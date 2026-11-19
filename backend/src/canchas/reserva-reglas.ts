import type { estado_reserva_cancha } from '@prisma/client';

/** Transiciones válidas del ciclo de vida de una reserva de cancha (RF-10). */
export const TRANSICIONES_RESERVA: Record<estado_reserva_cancha, estado_reserva_cancha[]> = {
  PENDIENTE_PAGO: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['CONFIRMADA', 'CANCELADA'],
  CANCELADA: [],
};

export const puedeTransicionar = (desde: estado_reserva_cancha, hacia: estado_reserva_cancha): boolean =>
  TRANSICIONES_RESERVA[desde].includes(hacia);

/** Cancelación sin penalidad hasta 24 h antes del turno; con menos antelación se retiene el 50% si ya estaba pagada. */
export const HORAS_SIN_PENALIDAD = 24;
export const PENALIDAD_PORCENTAJE = 0.5;

/** Grilla de disponibilidad: turnos de 1 h desde HORA_APERTURA hasta HORA_CIERRE (exclusivo). */
export const HORA_APERTURA = 8;
export const HORA_CIERRE = 23;
