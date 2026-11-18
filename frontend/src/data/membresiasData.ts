import { INITIAL_PLANES } from "./catalogosData";

export type EstadoMembresia = "Activa" | "Vencida" | "Suspendida";

export interface MembresiaItem {
  id: string;
  socioId: string;
  socioNombre: string;
  socioDni: string;
  socioEmail: string;
  planId: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoMembresia;
  renovacionAutomatica: boolean;
  importeContratado: number;
}

export const FECHA_REFERENCIA_DEMO = "2026-10-15";

export const INITIAL_MEMBRESIAS: MembresiaItem[] = [
  {
    id: "MEM-001",
    socioId: "SOC-101",
    socioNombre: "Mateo Silva",
    socioDni: "34.981.203",
    socioEmail: "mateo.silva@fitmail.com",
    planId: "PLAN-01",
    fechaInicio: "2025-12-15",
    fechaVencimiento: "2026-12-15",
    estado: "Activa",
    renovacionAutomatica: true,
    importeContratado: 180000,
  },
  {
    id: "MEM-002",
    socioId: "SOC-102",
    socioNombre: "Constanza Rivas",
    socioDni: "29.430.129",
    socioEmail: "constanza.rivas@gmail.com",
    planId: "PLAN-02",
    fechaInicio: "2026-08-24",
    fechaVencimiento: "2026-11-24",
    estado: "Activa",
    renovacionAutomatica: false,
    importeContratado: 75000,
  },
  {
    id: "MEM-003",
    socioId: "SOC-103",
    socioNombre: "Juan Pablo Bravo",
    socioDni: "31.849.502",
    socioEmail: "jp.bravo@outlook.com",
    planId: "PLAN-03",
    fechaInicio: "2026-09-08",
    fechaVencimiento: "2026-10-08",
    estado: "Vencida",
    renovacionAutomatica: false,
    importeContratado: 28500,
  },
  {
    id: "MEM-004",
    socioId: "SOC-104",
    socioNombre: "Francisca Soto",
    socioDni: "35.109.832",
    socioEmail: "fran.soto@empresa.com",
    planId: "PLAN-01",
    fechaInicio: "2026-01-12",
    fechaVencimiento: "2027-01-12",
    estado: "Suspendida",
    renovacionAutomatica: false,
    importeContratado: 180000,
  },
  {
    id: "MEM-005",
    socioId: "SOC-105",
    socioNombre: "Andrés Medina",
    socioDni: "30.402.184",
    socioEmail: "amedina@tech.cl",
    planId: "PLAN-03",
    fechaInicio: "2026-10-05",
    fechaVencimiento: "2026-11-05",
    estado: "Activa",
    renovacionAutomatica: true,
    importeContratado: 28500,
  },
  {
    id: "MEM-006",
    socioId: "SOC-106",
    socioNombre: "Isabel Fuentes",
    socioDni: "28.591.032",
    socioEmail: "isabel.fuentes@studio.com",
    planId: "PLAN-02",
    fechaInicio: "2026-08-20",
    fechaVencimiento: "2026-11-20",
    estado: "Activa",
    renovacionAutomatica: false,
    importeContratado: 75000,
  },
];

export function getMembresias(): MembresiaItem[] {
  return INITIAL_MEMBRESIAS.map((membresia) => ({ ...membresia }));
}

export function getMembresiaById(
  id: string,
): MembresiaItem | undefined {
  return getMembresias().find((membresia) => membresia.id === id);
}

export function getPlanMembresiaById(planId: string) {
  return INITIAL_PLANES.find((plan) => plan.id === planId);
}

export function formatearFechaMembresia(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function formatearImporteMembresia(importe: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(importe);
}