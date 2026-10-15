/**
 * FITZONE SPORTS - DATOS Y GESTIÓN DE CONFIGURACIÓN Y REPORTES (FASE 5)
 * RP-01: Reportes Consolidados Multi-Sede
 * CF-01: Configuración Global del Sistema
 */

// =============================================================================
// 1. REPORTES CONSOLIDADOS (RP-01)
// =============================================================================

export interface ReporteSedeItem {
  sedeId: string;
  nombreSede: string;
  ciudad: string;
  ingresoMembresias: number;
  ingresoCanchas: number;
  ingresoClases: number;
  ingresoTotal: number;
  sociosActivos: number;
  sociosNuevos: number;
  sociosBajas: number;
  tasaOcupacionCanchas: number; // Porcentaje ej: 84
  horasCanchaReservadas: number;
  deporteMasDemandado: "Pádel" | "Fútbol 5" | "Tenis";
  aforoPromedio: number; // Porcentaje ej: 76
  clasesDictadas: number;
  asistenciaClasesPct: number; // Porcentaje ej: 88
}

export interface HistoricoMensual {
  mes: string;
  ingresosTotales: number;
  membresias: number;
  canchas: number;
  clases: number;
  sociosTotales: number;
}

export interface DeporteMetrica {
  deporte: string;
  horasReservadas: number;
  recaudacion: number;
  ocupacionVallePct: number;
  ocupacionPicoPct: number;
  cancelacionesPct: number;
}

export interface ClaseDemandaMetrica {
  tipoClase: string;
  instructor: string;
  sede: string;
  asistenciaPct: number;
  enListaEspera: number;
  cuposLiberadosObserver: number;
}

// Datos de muestra multi-sede consolidados
export const MOCK_REPORTES_SEDES: ReporteSedeItem[] = [
  {
    sedeId: "parana-centro",
    nombreSede: "Sede Paraná Centro (Central)",
    ciudad: "Paraná",
    ingresoMembresias: 7450000,
    ingresoCanchas: 3820000,
    ingresoClases: 1150000,
    ingresoTotal: 12420000,
    sociosActivos: 840,
    sociosNuevos: 95,
    sociosBajas: 12,
    tasaOcupacionCanchas: 88,
    horasCanchaReservadas: 412,
    deporteMasDemandado: "Pádel",
    aforoPromedio: 78,
    clasesDictadas: 144,
    asistenciaClasesPct: 91,
  },
  {
    sedeId: "concordia-costanera",
    nombreSede: "Sede Concordia Costanera",
    ciudad: "Concordia",
    ingresoMembresias: 5200000,
    ingresoCanchas: 2950000,
    ingresoClases: 820000,
    ingresoTotal: 8970000,
    sociosActivos: 590,
    sociosNuevos: 62,
    sociosBajas: 9,
    tasaOcupacionCanchas: 82,
    horasCanchaReservadas: 320,
    deporteMasDemandado: "Pádel",
    aforoPromedio: 72,
    clasesDictadas: 110,
    asistenciaClasesPct: 86,
  },
  {
    sedeId: "gualeguaychu-parque",
    nombreSede: "Sede Gualeguaychú Parque",
    ciudad: "Gualeguaychú",
    ingresoMembresias: 4350000,
    ingresoCanchas: 3400000,
    ingresoClases: 650000,
    ingresoTotal: 8400000,
    sociosActivos: 480,
    sociosNuevos: 48,
    sociosBajas: 14,
    tasaOcupacionCanchas: 85,
    horasCanchaReservadas: 360,
    deporteMasDemandado: "Fútbol 5",
    aforoPromedio: 65,
    clasesDictadas: 96,
    asistenciaClasesPct: 84,
  },
  {
    sedeId: "concepcion-uruguay",
    nombreSede: "Sede Concepción del Uruguay",
    ciudad: "C. del Uruguay",
    ingresoMembresias: 3900000,
    ingresoCanchas: 2100000,
    ingresoClases: 540000,
    ingresoTotal: 6540000,
    sociosActivos: 430,
    sociosNuevos: 39,
    sociosBajas: 7,
    tasaOcupacionCanchas: 76,
    horasCanchaReservadas: 245,
    deporteMasDemandado: "Tenis",
    aforoPromedio: 74,
    clasesDictadas: 88,
    asistenciaClasesPct: 89,
  },
  {
    sedeId: "colon-costa",
    nombreSede: "Sede Colón Río",
    ciudad: "Colón",
    ingresoMembresias: 2800000,
    ingresoCanchas: 1650000,
    ingresoClases: 380000,
    ingresoTotal: 4830000,
    sociosActivos: 310,
    sociosNuevos: 28,
    sociosBajas: 5,
    tasaOcupacionCanchas: 71,
    horasCanchaReservadas: 180,
    deporteMasDemandado: "Pádel",
    aforoPromedio: 58,
    clasesDictadas: 64,
    asistenciaClasesPct: 82,
  },
];

// Evolución histórica mensual (Año 2026)
export const MOCK_HISTORICO_MENSUAL: HistoricoMensual[] = [
  { mes: "May 2026", ingresosTotales: 31200000, membresias: 18500000, canchas: 9800000, clases: 2900000, sociosTotales: 2280 },
  { mes: "Jun 2026", ingresosTotales: 33400000, membresias: 19800000, canchas: 10400000, clases: 3200000, sociosTotales: 2360 },
  { mes: "Jul 2026", ingresosTotales: 35900000, membresias: 21100000, canchas: 11200000, clases: 3600000, sociosTotales: 2450 },
  { mes: "Ago 2026", ingresosTotales: 37800000, membresias: 22400000, canchas: 11800000, clases: 3600000, sociosTotales: 2540 },
  { mes: "Sep 2026", ingresosTotales: 39500000, membresias: 23100000, canchas: 12600000, clases: 3800000, sociosTotales: 2600 },
  { mes: "Oct 2026 (Actual)", ingresosTotales: 41160000, membresias: 23700000, canchas: 13920000, clases: 3540000, sociosTotales: 2650 },
];

// Métricas de ocupación por deporte
export const MOCK_DEPORTES_METRICAS: DeporteMetrica[] = [
  { deporte: "Pádel Cristal Panorámico", horasReservadas: 792, recaudacion: 7524000, ocupacionVallePct: 74, ocupacionPicoPct: 96, cancelacionesPct: 3.2 },
  { deporte: "Fútbol 5 Césped Pro", horasReservadas: 485, recaudacion: 4850000, ocupacionVallePct: 62, ocupacionPicoPct: 94, cancelacionesPct: 4.8 },
  { deporte: "Tenis Polvo de Ladrillo", horasReservadas: 240, recaudacion: 1546000, ocupacionVallePct: 58, ocupacionPicoPct: 82, cancelacionesPct: 2.1 },
];

// Clases con alta demanda y lista de espera
export const MOCK_CLASES_DEMANDA: ClaseDemandaMetrica[] = [
  { tipoClase: "Spinning Pro Interval", instructor: "Prof. Marcos Galperín", sede: "Sede Paraná Centro", asistenciaPct: 98, enListaEspera: 14, cuposLiberadosObserver: 8 },
  { tipoClase: "CrossFit WOD Power", instructor: "Prof. Camila Rodríguez", sede: "Sede Paraná Centro", asistenciaPct: 95, enListaEspera: 11, cuposLiberadosObserver: 6 },
  { tipoClase: "Funcional HIIT", instructor: "Prof. Diego Latorre", sede: "Sede Concordia Costanera", asistenciaPct: 91, enListaEspera: 7, cuposLiberadosObserver: 5 },
  { tipoClase: "Power Yoga & Flex", instructor: "Prof. Lucía Méndez", sede: "Sede Gualeguaychú Parque", asistenciaPct: 88, enListaEspera: 5, cuposLiberadosObserver: 4 },
  { tipoClase: "Boxeo Técnico & Cardio", instructor: "Prof. Esteban Quito", sede: "Sede Concepción del Uruguay", asistenciaPct: 86, enListaEspera: 4, cuposLiberadosObserver: 2 },
];

// =============================================================================
// 2. CONFIGURACIÓN GLOBAL (CF-01)
// =============================================================================

export interface ConfiguracionGlobal {
  // Datos de la Cadena
  cadenaNombre: string;
  cadenaRazonSocial: string;
  cadenaCuit: string;
  cadenaMoneda: string;
  cadenaZonaHoraria: string;
  cadenaEmailContacto: string;
  cadenaTelefonoSoporte: string;
  modoMantenimientoGlobal: boolean;

  // Reglas de Negocio Deportivas (Strategy & Observer)
  horarioPicoHabilitado: boolean;
  horarioPicoInicio: string; // ej. "19:00"
  horarioPicoFin: string; // ej. "21:00"
  recargoHorarioPicoPct: number; // ej. 20 (%)
  descuentoSocioCanchaPct: number; // ej. 15 (%)
  diasAnticipacionClases: number; // ej. 2 (48 hs)
  limiteHorasCancelacionSinPenalidad: number; // ej. 2 (2 hs)
  tiempoRotacionQrSegundos: number; // ej. 60
  capacidadMaxListaEspera: number; // ej. 10
  tiempoEsperaConfirmacionMinutos: number; // ej. 15
  antiDuplicacionSedesHabilitada: boolean; // RN-01

  // Membresías y Morosidad
  diasGraciaMorosidad: number; // ej. 5
  bloquearTurnosSocioMoroso: boolean; // RN-03
  facturaElectronicaAutoHabilitada: boolean; // RF-14

  // Pasarela de Pagos Simulada (RF-13)
  pasarelaProveedor: "mercadopago" | "modo" | "payway";
  pasarelaModoSandbox: boolean;
  pasarelaPublicKeyMock: string;
  pasarelaSecretKeyMock: string;
  pasarelaComisionPct: number;

  // Notificaciones
  notificarEmailReserva: boolean;
  notificarWhatsappListaEspera: boolean;
  notificarAlertaAforoCritico: boolean;
  aforoCriticoUmbralPct: number; // ej. 85
}

export const DEFAULT_CONFIGURACION: ConfiguracionGlobal = {
  cadenaNombre: "FitZone Sports Network",
  cadenaRazonSocial: "FitZone Deportes y Entretenimiento S.A.",
  cadenaCuit: "30-71829340-9",
  cadenaMoneda: "ARS ($)",
  cadenaZonaHoraria: "America/Argentina/Buenos_Aires (GMT-3)",
  cadenaEmailContacto: "administracion@fitzonesports.com.ar",
  cadenaTelefonoSoporte: "+54 (343) 420-9900",
  modoMantenimientoGlobal: false,

  horarioPicoHabilitado: true,
  horarioPicoInicio: "19:00",
  horarioPicoFin: "21:00",
  recargoHorarioPicoPct: 20,
  descuentoSocioCanchaPct: 15,
  diasAnticipacionClases: 2,
  limiteHorasCancelacionSinPenalidad: 2,
  tiempoRotacionQrSegundos: 60,
  capacidadMaxListaEspera: 10,
  tiempoEsperaConfirmacionMinutos: 15,
  antiDuplicacionSedesHabilitada: true,

  diasGraciaMorosidad: 5,
  bloquearTurnosSocioMoroso: true,
  facturaElectronicaAutoHabilitada: true,

  pasarelaProveedor: "mercadopago",
  pasarelaModoSandbox: true,
  pasarelaPublicKeyMock: "TEST-948293-847291-FZON-002",
  pasarelaSecretKeyMock: "TEST-SK-482910-847291-SECRET",
  pasarelaComisionPct: 2.8,

  notificarEmailReserva: true,
  notificarWhatsappListaEspera: true,
  notificarAlertaAforoCritico: true,
  aforoCriticoUmbralPct: 85,
};

const STORAGE_KEY_CONFIG = "fitzone_config_global_fase5";

export function getConfiguracionGlobal(): ConfiguracionGlobal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return DEFAULT_CONFIGURACION;
    return { ...DEFAULT_CONFIGURACION, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIGURACION;
  }
}

export function saveConfiguracionGlobal(config: ConfiguracionGlobal): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Error guardando configuración global", e);
  }
}

export function resetConfiguracionGlobal(): ConfiguracionGlobal {
  try {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  } catch (e) {
    console.error("Error restableciendo configuración global", e);
  }
  return DEFAULT_CONFIGURACION;
}
