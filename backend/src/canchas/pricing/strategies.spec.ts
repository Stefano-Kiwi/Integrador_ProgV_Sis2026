import { describe, it, expect } from 'vitest';
import { TarifaEstandar } from './tarifa-estandar.strategy.js';
import { DescuentoSocio } from './descuento-socio.strategy.js';
import { RecargoHorarioPico } from './recargo-horario-pico.strategy.js';
import { TarifaExterno } from './tarifa-externo.strategy.js';
import type { PricingContext } from './pricing-strategy.interface.js';

const ctx = (parcial: Partial<PricingContext> = {}): PricingContext => ({
  costoHora: 10000,
  horaInicio: 15,
  esSocioActivo: false,
  ...parcial,
});

describe('TarifaEstandar', () => {
  const s = new TarifaEstandar();
  it('siempre aplica y no agrega ajustes', () => {
    expect(s.aplica()).toBe(true);
    expect(s.calcular(ctx())).toEqual({ descuento: 0, recargo: 0 });
  });
});

describe('DescuentoSocio', () => {
  const s = new DescuentoSocio();
  it('aplica solo a socios con membresía activa', () => {
    expect(s.aplica(ctx({ esSocioActivo: true }))).toBe(true);
    expect(s.aplica(ctx({ esSocioActivo: false }))).toBe(false);
  });
  it('descuenta el 15% del precio base', () => {
    expect(s.calcular(ctx({ costoHora: 8000, esSocioActivo: true }))).toEqual({ descuento: 1200, recargo: 0 });
  });
  it('redondea a centavos', () => {
    expect(s.calcular(ctx({ costoHora: 9999.99 })).descuento).toBe(1500);
  });
});

describe('RecargoHorarioPico', () => {
  const s = new RecargoHorarioPico();
  it.each([19, 20])('aplica en el turno de las %i h', (hora) => {
    expect(s.aplica(ctx({ horaInicio: hora }))).toBe(true);
  });
  it.each([18, 21, 0, 23])('no aplica en el turno de las %i h', (hora) => {
    expect(s.aplica(ctx({ horaInicio: hora }))).toBe(false);
  });
  it('agrega un recargo del 20% del precio base', () => {
    expect(s.calcular(ctx({ costoHora: 8000, horaInicio: 19 }))).toEqual({ descuento: 0, recargo: 1600 });
  });
});

describe('TarifaExterno', () => {
  const s = new TarifaExterno();
  it('aplica a quien no es socio activo (cliente externo, VENCIDO o SUSPENDIDO)', () => {
    expect(s.aplica(ctx({ esSocioActivo: false }))).toBe(true);
    expect(s.aplica(ctx({ esSocioActivo: true }))).toBe(false);
  });
  it('cobra precio de lista sin descuento', () => {
    expect(s.calcular(ctx())).toEqual({ descuento: 0, recargo: 0 });
  });
});
