import { Injectable } from '@nestjs/common';
import { redondear, type PricingAjuste, type PricingContext, type PricingStrategy } from './pricing-strategy.interface.js';

export const HORA_PICO_INICIO = 19;
export const HORA_PICO_FIN = 21; // exclusivo: los turnos de 19:00 y 20:00 están en horario pico
export const RECARGO_PICO_PORCENTAJE = 0.2;

/** Recargo del 20% sobre el precio base en horario pico, de 19:00 a 21:00 (RF-11). */
@Injectable()
export class RecargoHorarioPico implements PricingStrategy {
  readonly nombre = 'RecargoHorarioPico';

  aplica(ctx: PricingContext): boolean {
    return ctx.horaInicio >= HORA_PICO_INICIO && ctx.horaInicio < HORA_PICO_FIN;
  }

  calcular(ctx: PricingContext): PricingAjuste {
    return { descuento: 0, recargo: redondear(ctx.costoHora * RECARGO_PICO_PORCENTAJE) };
  }
}
