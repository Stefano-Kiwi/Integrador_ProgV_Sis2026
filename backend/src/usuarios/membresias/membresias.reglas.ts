import type { estado_membresia } from '@prisma/client';

/** Transiciones válidas del ciclo de vida de la membresía (RF-02). */
export const TRANSICIONES_MEMBRESIA: Record<estado_membresia, estado_membresia[]> = {
  PENDIENTE_PAGO: ['ACTIVO', 'SUSPENDIDO'],
  ACTIVO: ['VENCIDO', 'SUSPENDIDO'],
  VENCIDO: ['ACTIVO', 'SUSPENDIDO'],
  SUSPENDIDO: ['ACTIVO'],
};

export const puedeTransicionarMembresia = (
  desde: estado_membresia,
  hacia: estado_membresia,
): boolean => TRANSICIONES_MEMBRESIA[desde].includes(hacia);

export const sumarMeses = (base: Date, meses: number): Date => {
  const resultado = new Date(base);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
};
