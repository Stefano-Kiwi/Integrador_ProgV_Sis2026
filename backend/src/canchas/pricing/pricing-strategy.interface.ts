/** Datos que las estrategias necesitan para calcular el precio de un turno. */
export interface PricingContext {
  /** Costo por hora de la cancha (precio de lista). */
  costoHora: number;
  /** Hora de inicio del turno (0 a 23). */
  horaInicio: number;
  /** true solo si el usuario tiene una membresía ACTIVO (RN-03: VENCIDO/SUSPENDIDO no cuentan). */
  esSocioActivo: boolean;
}

/** Ajuste que aporta una estrategia sobre el precio base (valores en pesos, >= 0). */
export interface PricingAjuste {
  descuento: number;
  recargo: number;
}

/**
 * Patrón Strategy (RF-11). Cada tarifa es una clase intercambiable.
 * Para agregar una nueva: crear la clase que implemente esta interfaz y registrarla
 * en `PRICING_STRATEGY_CLASSES` (pricing/index.ts). No hay que tocar ningún otro código.
 */
export interface PricingStrategy {
  readonly nombre: string;
  /** Indica si la estrategia corresponde a este contexto. */
  aplica(ctx: PricingContext): boolean;
  /** Ajuste (descuento y/o recargo) que aporta cuando aplica. */
  calcular(ctx: PricingContext): PricingAjuste;
}

/** Token de inyección con la lista de estrategias registradas. */
export const PRICING_STRATEGIES = Symbol('PRICING_STRATEGIES');

/** Redondea a 2 decimales (centavos). */
export const redondear = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;
