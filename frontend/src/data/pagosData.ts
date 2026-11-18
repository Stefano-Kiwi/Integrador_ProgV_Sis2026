export interface Transaction {
  id: string;
  socio: string;
  dni: string;
  concepto: string;
  fecha: string;
  monto: number;
  medioPago: "Tarjeta de Crédito" | "Débito" | "MercadoPago" | "Transferencia" | "Efectivo" | "Modo" | "Tarjeta";
  estado: "Aprobado" | "Pendiente" | "Rechazado";
  comprobanteNro: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "#TRX-8924",
    socio: "Mateo Silva",
    dni: "34.981.203",
    concepto: "Membresía Anual Black",
    fecha: "14 Oct, 09:15",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018924",
  },
  {
    id: "#TRX-8923",
    socio: "Isabel Fuentes",
    dni: "28.591.032",
    concepto: "Reserva Pádel (Desc. Socio)",
    fecha: "13 Oct, 18:30",
    monto: 10200,
    medioPago: "MercadoPago",
    estado: "Aprobado",
    comprobanteNro: "0004-00018923",
  },
  {
    id: "#TRX-8922",
    socio: "Juan Pablo Bravo",
    dni: "31.849.502",
    concepto: "Renovación Mensual Pase",
    fecha: "13 Oct, 10:05",
    monto: 28500,
    medioPago: "Transferencia",
    estado: "Pendiente",
    comprobanteNro: "0004-00018922",
  },
  {
    id: "#TRX-8921",
    socio: "Roberto Gómez (Externo)",
    dni: "38.291.402",
    concepto: "Reserva Fútbol 5 (Hora Pico)",
    fecha: "12 Oct, 19:00",
    monto: 25000,
    medioPago: "Débito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018921",
  },
  {
    id: "#TRX-8920",
    socio: "Francisca Soto",
    dni: "35.109.832",
    concepto: "Membresía Anual Black",
    fecha: "12 Oct, 08:45",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Rechazado",
    comprobanteNro: "0004-00018920",
  },
  {
    id: "#TRX-8919",
    socio: "Constanza Rivas",
    dni: "29.430.129",
    concepto: "Membresía Trimestral Fit",
    fecha: "11 Oct, 16:20",
    monto: 75000,
    medioPago: "MercadoPago",
    estado: "Aprobado",
    comprobanteNro: "0004-00018919",
  },
  {
    id: "#TRX-8918",
    socio: "Andrés Medina",
    dni: "30.402.184",
    concepto: "Alquiler Cancha Pádel 3",
    fecha: "11 Oct, 11:00",
    monto: 12000,
    medioPago: "Efectivo",
    estado: "Aprobado",
    comprobanteNro: "0004-00018918",
  },
  {
    id: "#TRX-8917",
    socio: "Diego Fernández",
    dni: "36.882.104",
    concepto: "Pase Diario Entrenamiento",
    fecha: "10 Oct, 14:15",
    monto: 6500,
    medioPago: "Débito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018917",
  },
  {
    id: "#TRX-8916",
    socio: "Valentina Rossi",
    dni: "27.604.119",
    concepto: "Renovación Mensual Pase",
    fecha: "10 Oct, 09:30",
    monto: 28500,
    medioPago: "Transferencia",
    estado: "Rechazado",
    comprobanteNro: "0004-00018916",
  },
  {
    id: "#TRX-8915",
    socio: "Lucas San Martín",
    dni: "33.712.940",
    concepto: "Membresía Anual Black",
    fecha: "09 Oct, 17:40",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018915",
  },
];

let pagosEnMemoria: Transaction[] = [...INITIAL_TRANSACTIONS];

export function getPagos(): Transaction[] {
  return pagosEnMemoria.map((pago) => ({ ...pago }));
}

export function getPagoById(id: string): Transaction | undefined {
  return getPagos().find((pago) => pago.id === id);
}

export function savePago(pago: Transaction): void {
  const existe = pagosEnMemoria.some((item) => item.id === pago.id);

  pagosEnMemoria = existe
    ? pagosEnMemoria.map((item) =>
        item.id === pago.id ? { ...pago } : item,
      )
    : [{ ...pago }, ...pagosEnMemoria];
}