import { describe, it, expect } from 'vitest';
import { PricingService } from './pricing.service.js';
import { PRICING_STRATEGY_CLASSES } from './index.js';
import type { PricingContext, PricingStrategy } from './pricing-strategy.interface.js';

const crearService = (extra: PricingStrategy[] = []) =>
  new PricingService([...PRICING_STRATEGY_CLASSES.map((C) => new C()), ...extra]);

const ctx = (parcial: Partial<PricingContext> = {}): PricingContext => ({
  costoHora: 10000,
  horaInicio: 15,
  esSocioActivo: false,
  ...parcial,
});

describe('PricingService', () => {
  it('externo en horario normal: paga precio de lista', () => {
    const r = crearService().calcular(ctx());
    expect(r).toMatchObject({ precio_base: 10000, descuento: 0, recargo: 0, monto_total: 10000 });
    expect(r.estrategias_aplicadas).toEqual(['TarifaEstandar', 'TarifaExterno']);
  });

  it('socio activo en horario normal: 15% de descuento', () => {
    const r = crearService().calcular(ctx({ esSocioActivo: true }));
    expect(r).toMatchObject({ precio_base: 10000, descuento: 1500, recargo: 0, monto_total: 8500 });
    expect(r.estrategias_aplicadas).toEqual(['TarifaEstandar', 'DescuentoSocio']);
  });

  it('externo en horario pico: recargo del 20%', () => {
    const r = crearService().calcular(ctx({ horaInicio: 19 }));
    expect(r).toMatchObject({ descuento: 0, recargo: 2000, monto_total: 12000 });
    expect(r.estrategias_aplicadas).toContain('RecargoHorarioPico');
  });

  it('socio activo en horario pico: combina descuento y recargo', () => {
    const r = crearService().calcular(ctx({ esSocioActivo: true, horaInicio: 20 }));
    expect(r).toMatchObject({ precio_base: 10000, descuento: 1500, recargo: 2000, monto_total: 10500 });
  });

  it('RN-03: un socio con membresía vencida/suspendida (esSocioActivo=false) no recibe descuento', () => {
    const r = crearService().calcular(ctx({ esSocioActivo: false }));
    expect(r.descuento).toBe(0);
    expect(r.estrategias_aplicadas).toContain('TarifaExterno');
  });

  it('permite sumar una estrategia nueva sin modificar el servicio', () => {
    const feriado: PricingStrategy = {
      nombre: 'RecargoFeriado',
      aplica: () => true,
      calcular: (c) => ({ descuento: 0, recargo: c.costoHora * 0.1 }),
    };
    const r = crearService([feriado]).calcular(ctx());
    expect(r.recargo).toBe(1000);
    expect(r.monto_total).toBe(11000);
    expect(r.estrategias_aplicadas).toContain('RecargoFeriado');
  });

  it('el monto total nunca es negativo', () => {
    const regalo: PricingStrategy = {
      nombre: 'Regalo',
      aplica: () => true,
      calcular: (c) => ({ descuento: c.costoHora * 5, recargo: 0 }),
    };
    expect(crearService([regalo]).calcular(ctx()).monto_total).toBe(0);
  });
});
