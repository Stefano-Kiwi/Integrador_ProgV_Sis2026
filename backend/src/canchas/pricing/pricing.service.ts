import { Inject, Injectable } from '@nestjs/common';
import {
  PRICING_STRATEGIES,
  redondear,
  type PricingContext,
  type PricingStrategy,
} from './pricing-strategy.interface.js';

export interface PrecioCalculado {
  precio_base: number;
  descuento: number;
  recargo: number;
  monto_total: number;
  /** Nombres de las estrategias que participaron del cálculo (trazabilidad). */
  estrategias_aplicadas: string[];
}

/** Context del patrón Strategy: compone todas las estrategias registradas que apliquen al contexto. */
@Injectable()
export class PricingService {
  constructor(@Inject(PRICING_STRATEGIES) private readonly estrategias: PricingStrategy[]) {}

  calcular(ctx: PricingContext): PrecioCalculado {
    const precio_base = redondear(ctx.costoHora);
    let descuento = 0;
    let recargo = 0;
    const estrategias_aplicadas: string[] = [];

    for (const estrategia of this.estrategias) {
      if (!estrategia.aplica(ctx)) continue;
      const ajuste = estrategia.calcular(ctx);
      descuento += ajuste.descuento;
      recargo += ajuste.recargo;
      estrategias_aplicadas.push(estrategia.nombre);
    }

    descuento = redondear(descuento);
    recargo = redondear(recargo);
    const monto_total = Math.max(0, redondear(precio_base - descuento + recargo));

    return { precio_base, descuento, recargo, monto_total, estrategias_aplicadas };
  }
}
