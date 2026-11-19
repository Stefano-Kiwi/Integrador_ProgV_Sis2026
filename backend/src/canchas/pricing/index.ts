import { TarifaEstandar } from './tarifa-estandar.strategy.js';
import { DescuentoSocio } from './descuento-socio.strategy.js';
import { RecargoHorarioPico } from './recargo-horario-pico.strategy.js';
import { TarifaExterno } from './tarifa-externo.strategy.js';

export * from './pricing-strategy.interface.js';
export * from './pricing.service.js';
export { TarifaEstandar, DescuentoSocio, RecargoHorarioPico, TarifaExterno };

/**
 * Estrategias registradas. Para sumar una tarifa nueva: crear la clase y agregarla acá.
 * CanchasModule las registra como providers y las inyecta en PricingService automáticamente.
 */
export const PRICING_STRATEGY_CLASSES = [TarifaEstandar, DescuentoSocio, RecargoHorarioPico, TarifaExterno];
