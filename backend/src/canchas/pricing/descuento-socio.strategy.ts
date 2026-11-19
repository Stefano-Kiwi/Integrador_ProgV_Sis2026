import { Injectable } from '@nestjs/common';
import { redondear, type PricingAjuste, type PricingContext, type PricingStrategy } from './pricing-strategy.interface.js';

export const DESCUENTO_SOCIO_PORCENTAJE = 0.15;

/** Descuento del 15% sobre el precio base para socios con membresía ACTIVO (RF-11). */
@Injectable()
export class DescuentoSocio implements PricingStrategy {
  readonly nombre = 'DescuentoSocio';

  aplica(ctx: PricingContext): boolean {
    return ctx.esSocioActivo;
  }

  calcular(ctx: PricingContext): PricingAjuste {
    return { descuento: redondear(ctx.costoHora * DESCUENTO_SOCIO_PORCENTAJE), recargo: 0 };
  }
}
