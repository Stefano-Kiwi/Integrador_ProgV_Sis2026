export interface SedeCanchaInfo {
  id: string;
  nombre: string;
  tipo: "Paddle Cristal" | "Paddle Muro" | "Fútbol 5 Césped";
  estado: "Disponible" | "Ocupada" | "Mantenimiento";
  precioHora: number;
}

export interface SedeClaseInfo {
  id: string;
  nombre: string;
  instructor: string;
  horario: string;
  sala: string;
  cupoActual: number;
  cupoMax: number;
}

export interface SedeStaffInfo {
  id: string;
  nombre: string;
  rol: "Gerente de Sede" | "Recepcionista" | "Profesor Coordinador";
  turno: "Mañana (06:00 - 14:00)" | "Tarde (14:00 - 22:00)";
  telefono: string;
}

export interface SedeItem {
  id: string;
  nombre: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  gerente: string;
  capacidadMax: number;
  aforoActual: number;
  canchasCount: number;
  salasCount: number;
  sociosAsignados: number;
  estado: "Operativa" | "Mantenimiento" | "Próxima Apertura";
  servicios: string[];
  imagenUrl: string;
  // Ficha detallada (S-03)
  canchas: SedeCanchaInfo[];
  clasesHoy: SedeClaseInfo[];
  staff: SedeStaffInfo[];
}

export const INITIAL_SEDES: SedeItem[] = [
  {
    id: "parana-centro",
    nombre: "Sede Paraná Centro (Central)",
    provincia: "Entre Ríos",
    ciudad: "Paraná",
    direccion: "San Martín 850, Paraná",
    telefono: "+54 343 422-9010",
    email: "parana@fitzone.com.ar",
    horario: "Lun-Vie: 06:00 a 23:00 • Sáb: 08:00 a 20:00",
    gerente: "Valeria Morales",
    capacidadMax: 320,
    aforoActual: 246,
    canchasCount: 6,
    salasCount: 4,
    sociosAsignados: 4850,
    estado: "Operativa",
    servicios: ["Paddle Cristal Panorámico", "Fútbol 5 FIFA", "Spinning Pro", "CrossFit Box", "Sauna & Recuperación"],
    imagenUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    canchas: [
      { id: "C-PAR-1", nombre: "Cancha Paddle 1 (Cristal)", tipo: "Paddle Cristal", estado: "Ocupada", precioHora: 12000 },
      { id: "C-PAR-2", nombre: "Cancha Paddle 2 (Cristal)", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 12000 },
      { id: "C-PAR-3", nombre: "Cancha Paddle 3 (Muro)", tipo: "Paddle Muro", estado: "Disponible", precioHora: 10000 },
      { id: "C-PAR-4", nombre: "Cancha Fútbol 5 - Estadio A", tipo: "Fútbol 5 Césped", estado: "Ocupada", precioHora: 22000 },
      { id: "C-PAR-5", nombre: "Cancha Fútbol 5 - Cancha B", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 20000 },
      { id: "C-PAR-6", nombre: "Cancha Paddle 4 (Techada)", tipo: "Paddle Cristal", estado: "Mantenimiento", precioHora: 12000 },
    ],
    clasesHoy: [
      { id: "CLS-101", nombre: "Spinning de Potencia", instructor: "Martín Palermo", horario: "08:00 - 09:00", sala: "Sala Ciclo 1", cupoActual: 20, cupoMax: 20 },
      { id: "CLS-102", nombre: "CrossFit WOD Fuerza", instructor: "Diego Arana", horario: "10:30 - 11:30", sala: "Box Central", cupoActual: 16, cupoMax: 18 },
      { id: "CLS-103", nombre: "Power Yoga & Flex", instructor: "Sofía Vergara", horario: "18:00 - 19:00", sala: "Estudio Zen", cupoActual: 12, cupoMax: 15 },
      { id: "CLS-104", nombre: "Box Fit Funcional", instructor: "Esteban Quiroga", horario: "19:30 - 20:30", sala: "Sala 2", cupoActual: 15, cupoMax: 15 },
    ],
    staff: [
      { id: "ST-01", nombre: "Valeria Morales", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 343 512-3344" },
      { id: "ST-02", nombre: "Lucas Benítez", rol: "Recepcionista", turno: "Mañana (06:00 - 14:00)", telefono: "+54 343 490-1122" },
      { id: "ST-03", nombre: "Camila Ruiz", rol: "Recepcionista", turno: "Tarde (14:00 - 22:00)", telefono: "+54 343 477-8899" },
      { id: "ST-04", nombre: "Martín Palermo", rol: "Profesor Coordinador", turno: "Mañana (06:00 - 14:00)", telefono: "+54 343 655-4433" },
    ],
  },
  {
    id: "concordia-costanera",
    nombre: "Sede Concordia Costanera",
    provincia: "Entre Ríos",
    ciudad: "Concordia",
    direccion: "Av. Costanera de los Pueblos 410, Concordia",
    telefono: "+54 345 421-8840",
    email: "concordia@fitzone.com.ar",
    horario: "Lun-Vie: 06:30 a 22:30 • Sáb: 08:00 a 20:00",
    gerente: "Felipe Oyarzún",
    capacidadMax: 260,
    aforoActual: 195,
    canchasCount: 5,
    salasCount: 3,
    sociosAsignados: 3920,
    estado: "Operativa",
    servicios: ["Paddle Panorámico Climatizado", "Césped Sintético F5", "Power Yoga", "Pilates Reformer"],
    imagenUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80",
    canchas: [
      { id: "C-CON-1", nombre: "Cancha Paddle Río 1", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 11000 },
      { id: "C-CON-2", nombre: "Cancha Paddle Río 2", tipo: "Paddle Cristal", estado: "Ocupada", precioHora: 11000 },
      { id: "C-CON-3", nombre: "Cancha Fútbol 5 Costanera", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 19000 },
      { id: "C-CON-4", nombre: "Cancha Fútbol 5 Norte", tipo: "Fútbol 5 Césped", estado: "Ocupada", precioHora: 19000 },
      { id: "C-CON-5", nombre: "Cancha Paddle Muro 3", tipo: "Paddle Muro", estado: "Disponible", precioHora: 9500 },
    ],
    clasesHoy: [
      { id: "CLS-201", nombre: "Pilates Reformer", instructor: "Carla Méndez", horario: "09:00 - 10:00", sala: "Sala Pilates", cupoActual: 8, cupoMax: 8 },
      { id: "CLS-202", nombre: "Funcional Circuit", instructor: "Joaquín Ríos", horario: "19:00 - 20:00", sala: "Área Libre", cupoActual: 14, cupoMax: 20 },
    ],
    staff: [
      { id: "ST-05", nombre: "Felipe Oyarzún", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 345 540-9911" },
      { id: "ST-06", nombre: "Mariana Albornoz", rol: "Recepcionista", turno: "Tarde (14:00 - 22:00)", telefono: "+54 345 401-2233" },
    ],
  },
  {
    id: "gualeguaychu-parque",
    nombre: "Sede Gualeguaychú Parque",
    provincia: "Entre Ríos",
    ciudad: "Gualeguaychú",
    direccion: "Urquiza al Oeste 1120, Gualeguaychú",
    telefono: "+54 3446 43-5500",
    email: "gualeguaychu@fitzone.com.ar",
    horario: "Lun-Vie: 07:00 a 22:00 • Sáb: 09:00 a 19:00",
    gerente: "Camila Echeverría",
    capacidadMax: 200,
    aforoActual: 120,
    canchasCount: 4,
    salasCount: 2,
    sociosAsignados: 2350,
    estado: "Operativa",
    servicios: ["Paddle Cristal", "Piscina Climatizada 25m", "Sala Wellness", "Cafetería Saludable"],
    imagenUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
    canchas: [
      { id: "C-GUA-1", nombre: "Cancha Paddle Cristal A", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 11000 },
      { id: "C-GUA-2", nombre: "Cancha Paddle Cristal B", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 11000 },
      { id: "C-GUA-3", nombre: "Cancha Fútbol 5 Parque", tipo: "Fútbol 5 Césped", estado: "Ocupada", precioHora: 18000 },
      { id: "C-GUA-4", nombre: "Cancha Paddle Muro C", tipo: "Paddle Muro", estado: "Mantenimiento", precioHora: 9000 },
    ],
    clasesHoy: [
      { id: "CLS-301", nombre: "Aquagym & Natación", instructor: "Mariana Gómez", horario: "10:00 - 11:00", sala: "Natatorio Climatizado", cupoActual: 15, cupoMax: 15 },
      { id: "CLS-302", nombre: "Yoga Terapéutico", instructor: "Lucía Bianchi", horario: "17:30 - 18:30", sala: "Sala Zen", cupoActual: 10, cupoMax: 12 },
    ],
    staff: [
      { id: "ST-07", nombre: "Camila Echeverría", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 3446 62-1144" },
      { id: "ST-08", nombre: "Bruno Peralta", rol: "Recepcionista", turno: "Tarde (14:00 - 22:00)", telefono: "+54 3446 55-9988" },
    ],
  },
  {
    id: "concepcion-uruguay",
    nombre: "Sede Concepción del Uruguay",
    provincia: "Entre Ríos",
    ciudad: "Concepción del Uruguay",
    direccion: "9 de Julio 320, Concepción del Uruguay",
    telefono: "+54 3442 42-7711",
    email: "cdu@fitzone.com.ar",
    horario: "Lun-Vie: 06:00 a 23:00 • Sáb-Dom: 08:00 a 21:00",
    gerente: "Ignacio Carrasco",
    capacidadMax: 240,
    aforoActual: 188,
    canchasCount: 4,
    salasCount: 3,
    sociosAsignados: 2840,
    estado: "Operativa",
    servicios: ["CrossFit Zone", "Box Fit", "Spinning", "Área Musculación Pesada"],
    imagenUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    canchas: [
      { id: "C-CDU-1", nombre: "Cancha Paddle Puerto 1", tipo: "Paddle Cristal", estado: "Ocupada", precioHora: 11000 },
      { id: "C-CDU-2", nombre: "Cancha Paddle Puerto 2", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 11000 },
      { id: "C-CDU-3", nombre: "Cancha F5 Sintético", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 18500 },
      { id: "C-CDU-4", nombre: "Cancha F5 Iluminada", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 18500 },
    ],
    clasesHoy: [
      { id: "CLS-401", nombre: "CrossFit Elite", instructor: "Diego Arana", horario: "07:30 - 08:30", sala: "Box", cupoActual: 18, cupoMax: 18 },
      { id: "CLS-402", nombre: "Spinning Resistencia", instructor: "M. José Ramos", horario: "19:00 - 20:00", sala: "Sala Ciclo", cupoActual: 19, cupoMax: 20 },
    ],
    staff: [
      { id: "ST-09", nombre: "Ignacio Carrasco", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 3442 40-7733" },
      { id: "ST-10", nombre: "Florencia Paz", rol: "Recepcionista", turno: "Mañana (06:00 - 14:00)", telefono: "+54 3442 51-2211" },
    ],
  },
  {
    id: "colon-costa",
    nombre: "Sede Colón Río",
    provincia: "Entre Ríos",
    ciudad: "Colón",
    direccion: "Av. Quirós 250, Colón",
    telefono: "+54 3447 42-1080",
    email: "colon@fitzone.com.ar",
    horario: "Lun-Vie: 07:00 a 21:30 • Sáb: 09:00 a 18:00",
    gerente: "Esteban Quiroga",
    capacidadMax: 170,
    aforoActual: 84,
    canchasCount: 3,
    salasCount: 2,
    sociosAsignados: 1444,
    estado: "Mantenimiento",
    servicios: ["Musculación", "Funcional", "Paddle Muro (En reforma de césped)"],
    imagenUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80",
    canchas: [
      { id: "C-COL-1", nombre: "Cancha Paddle 1 (Mantenimiento)", tipo: "Paddle Cristal", estado: "Mantenimiento", precioHora: 0 },
      { id: "C-COL-2", nombre: "Cancha Paddle 2", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 10500 },
      { id: "C-COL-3", nombre: "Cancha F5 Césped", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 17500 },
    ],
    clasesHoy: [
      { id: "CLS-501", nombre: "Funcional Express", instructor: "Ramiro Vega", horario: "18:00 - 19:00", sala: "Sala 1", cupoActual: 10, cupoMax: 14 },
    ],
    staff: [
      { id: "ST-11", nombre: "Esteban Quiroga", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 3447 48-1122" },
      { id: "ST-12", nombre: "Nicolás Sosa", rol: "Recepcionista", turno: "Tarde (14:00 - 22:00)", telefono: "+54 3447 50-3344" },
    ],
  },
];

// Helper para persistencia en memoria local durante la sesión
let sedesMemoryState: SedeItem[] = [...INITIAL_SEDES];

export function getSedes(): SedeItem[] {
  return sedesMemoryState;
}

export function getSedeById(id: string): SedeItem | undefined {
  return sedesMemoryState.find((s) => s.id === id);
}

export function saveSede(sede: SedeItem): void {
  const index = sedesMemoryState.findIndex((s) => s.id === sede.id);
  if (index >= 0) {
    sedesMemoryState[index] = sede;
  } else {
    sedesMemoryState = [sede, ...sedesMemoryState];
  }
}
