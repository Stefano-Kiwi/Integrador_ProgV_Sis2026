import { Injectable } from '@nestjs/common';
import type { PricingAjuste, PricingContext, PricingStrategy } from './pricing-strategy.interface.js';

/** Tarifa estándar: precio de lista de la cancha. Siempre aplica y no agrega ajustes. */
@Injectable()
export class TarifaEstandar implements PricingStrategy {
  readonly nombre = 'TarifaEstandar';

  aplica(): boolean {
    return true;
  }

  calcular(_ctx: PricingContext): PricingAjuste {
    return { descuento: 0, recargo: 0 };
  }
}
