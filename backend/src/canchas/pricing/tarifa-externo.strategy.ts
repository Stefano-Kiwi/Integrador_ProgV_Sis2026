import { Injectable } from '@nestjs/common';
import type { PricingAjuste, PricingContext, PricingStrategy } from './pricing-strategy.interface.js';

/**
 * Tarifa de cliente externo (RN-03): precio de lista sin beneficios de socio.
 * Aplica a quien no tiene membresía ACTIVO: clientes externos y socios con membresía
 * VENCIDO o SUSPENDIDO. No agrega ajustes; sirve para dejar explícito (y trazable en
 * `estrategias_aplicadas`) que la reserva se cobró como externo.
 */
@Injectable()
export class TarifaExterno implements PricingStrategy {
  readonly nombre = 'TarifaExterno';

  aplica(ctx: PricingContext): boolean {
    return !ctx.esSocioActivo;
  }

  calcular(_ctx: PricingContext): PricingAjuste {
    return { descuento: 0, recargo: 0 };
  }
}
