// ==========================================================================
// DATOS HARDCODEADOS PARA CATÁLOGOS (FASE 1: C-04, C-05, CA-05, PL-01)
// 100% Mock en memoria para front estático sin conexión a backend
// ==========================================================================

// --- C-04: INSTRUCTORES ---
export interface InstructorItem {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  avatar: string;
  especialidades: string[];
  sedesAsignadas: string[];
  estado: "Activo" | "Vacaciones" | "Licencia";
  clasesSemanales: number;
  calificacion: number;
}

export const INITIAL_INSTRUCTORES: InstructorItem[] = [
  {
    id: "INST-01",
    nombre: "Martín Palermo",
    dni: "28.450.119",
    email: "mpalermo@fitzone.com.ar",
    telefono: "+54 343 512-3344",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    especialidades: ["Spinning Pro", "Musculación", "HIIT"],
    sedesAsignadas: ["Paraná Centro", "Concordia Costanera"],
    estado: "Activo",
    clasesSemanales: 14,
    calificacion: 4.9,
  },
  {
    id: "INST-02",
    nombre: "Diego Arana",
    dni: "31.902.441",
    email: "darana@fitzone.com.ar",
    telefono: "+54 343 490-5566",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    especialidades: ["CrossFit Box", "Funcional Circuit", "Levantamiento Olímpico"],
    sedesAsignadas: ["Paraná Centro", "Concepción del Uruguay"],
    estado: "Activo",
    clasesSemanales: 16,
    calificacion: 4.8,
  },
  {
    id: "INST-03",
    nombre: "Sofía Vergara",
    dni: "33.210.874",
    email: "svergara@fitzone.com.ar",
    telefono: "+54 3446 62-1144",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    especialidades: ["Power Yoga", "Pilates Mat", "Stretching Postural"],
    sedesAsignadas: ["Gualeguaychú Parque", "Paraná Centro"],
    estado: "Activo",
    clasesSemanales: 10,
    calificacion: 5.0,
  },
  {
    id: "INST-04",
    nombre: "María José Ramos",
    dni: "30.144.920",
    email: "mjramos@fitzone.com.ar",
    telefono: "+54 3442 40-7733",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    especialidades: ["Spinning Resistencia", "Aqua Aerobics", "GAP"],
    sedesAsignadas: ["Concepción del Uruguay", "Colón Río"],
    estado: "Activo",
    clasesSemanales: 12,
    calificacion: 4.7,
  },
  {
    id: "INST-05",
    nombre: "Esteban Quiroga",
    dni: "29.800.312",
    email: "equiroga@fitzone.com.ar",
    telefono: "+54 3447 48-1122",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    especialidades: ["Box Fit", "Funcional", "Preparación Física Paddle"],
    sedesAsignadas: ["Colón Río", "Concordia Costanera"],
    estado: "Vacaciones",
    clasesSemanales: 8,
    calificacion: 4.6,
  },
  {
    id: "INST-06",
    nombre: "Carla Méndez",
    dni: "35.401.782",
    email: "cmendez@fitzone.com.ar",
    telefono: "+54 345 421-8840",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    especialidades: ["Pilates Reformer", "Yoga Terapéutico", "Flexibilidad"],
    sedesAsignadas: ["Concordia Costanera"],
    estado: "Activo",
    clasesSemanales: 14,
    calificacion: 4.9,
  },
];

// --- C-05: TIPOS DE CLASE ---
export interface TipoClaseItem {
  id: string;
  nombre: string;
  disciplina: string;
  intensidad: "Baja" | "Media" | "Alta" | "Extrema";
  duracionMin: number;
  cupoMaxSugerido: number;
  salaRequerida: string;
  caloriasAprox: number;
  descripcion: string;
  equipamiento: string[];
  estado: "Activo" | "Inactivo";
}

export const INITIAL_TIPOS_CLASE: TipoClaseItem[] = [
  {
    id: "TC-01",
    nombre: "Spinning Pro (Indoor Cycling)",
    disciplina: "Cardio / Resistencia",
    intensidad: "Alta",
    duracionMin: 50,
    cupoMaxSugerido: 20,
    salaRequerida: "Sala Ciclo Climatizada",
    caloriasAprox: 600,
    descripcion: "Entrenamiento cardiovascular en bicicleta fija con intervalos de potencia, subidas y sprints al ritmo de la música.",
    equipamiento: ["Bicicletas fijas magnéticas", "Monitor cardíaco", "Zapatillas SPD"],
    estado: "Activo",
  },
  {
    id: "TC-02",
    nombre: "CrossFit WOD Elite",
    disciplina: "Fuerza & Acondicionamiento",
    intensidad: "Extrema",
    duracionMin: 60,
    cupoMaxSugerido: 18,
    salaRequerida: "Box Central CrossFit",
    caloriasAprox: 750,
    descripcion: "Movimientos funcionales constantemente variados ejecutados a alta intensidad: barras olímpicas, kettlebells, remos y saltos al cajón.",
    equipamiento: ["Barras olímpicas", "Kettlebells", "Cajones de salto", "Racks"],
    estado: "Activo",
  },
  {
    id: "TC-03",
    nombre: "Power Yoga & Flex",
    disciplina: "Mente y Cuerpo / Flexibilidad",
    intensidad: "Media",
    duracionMin: 60,
    cupoMaxSugerido: 15,
    salaRequerida: "Estudio Zen",
    caloriasAprox: 300,
    descripcion: "Práctica dinámica y vigorosa que une posturas fluidas con respiración controlada para mejorar fuerza isométrica y serenidad mental.",
    equipamiento: ["Mats de yoga", "Bloques de corcho", "Correas de elongación"],
    estado: "Activo",
  },
  {
    id: "TC-04",
    nombre: "Pilates Reformer Studio",
    disciplina: "Control Motor y Postura",
    intensidad: "Media",
    duracionMin: 50,
    cupoMaxSugerido: 8,
    salaRequerida: "Sala Pilates Reformer",
    caloriasAprox: 350,
    descripcion: "Entrenamiento de precisión sobre camillas con resortes que tonifica la musculatura profunda abdominal y estabiliza la columna.",
    equipamiento: ["Camillas Reformer", "Cajas de salto", "Resortes ajustables"],
    estado: "Activo",
  },
  {
    id: "TC-05",
    nombre: "Box Fit Knockout",
    disciplina: "Combate Funcional",
    intensidad: "Alta",
    duracionMin: 55,
    cupoMaxSugerido: 16,
    salaRequerida: "Sala de Combate / Bolsa",
    caloriasAprox: 680,
    descripcion: "Combinación de técnicas de boxeo recreativo con rounds de pesas rusas y saltos de cuerda. Sin contacto físico entre alumnos.",
    equipamiento: ["Bolsas de boxeo pesadas", "Guantines", "Vendas protectoras", "Cuerdas"],
    estado: "Activo",
  },
  {
    id: "TC-06",
    nombre: "Aquagym & Natación Funcional",
    disciplina: "Acuática / Bajo Impacto",
    intensidad: "Baja",
    duracionMin: 45,
    cupoMaxSugerido: 15,
    salaRequerida: "Natatorio Climatizado 25m",
    caloriasAprox: 400,
    descripcion: "Ejercicios aeróbicos y de tonificación en piscina con resistencia del agua, ideales para cuidar articulaciones y rehabilitar fuerza.",
    equipamiento: ["Flotadores de goma eva", "Mancuernas acuáticas", "Tablas"],
    estado: "Activo",
  },
];

// --- CA-05: TIPOS DE CANCHA ---
export interface TipoCanchaItem {
  id: string;
  nombre: string;
  deporte: "Paddle" | "Fútbol 5" | "Tenis";
  superficie: string;
  tarifaBaseHora: number;
  duracionTurnoMin: number;
  descuentoSocioPorc: number; // 15% según RF-11
  recargoHoraPicoPorc: number; // 20% según RF-11 (19:00 - 21:00)
  totalCanchasEnRed: number;
  estado: "Habilitado" | "En Revisión";
}

export const INITIAL_TIPOS_CANCHA: TipoCanchaItem[] = [
  {
    id: "TCAN-01",
    nombre: "Paddle Cristal Panorámico (WPT Pro)",
    deporte: "Paddle",
    superficie: "Césped Sintético Texturado Azul con arena de sílice",
    tarifaBaseHora: 12000,
    duracionTurnoMin: 90,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    totalCanchasEnRed: 12,
    estado: "Habilitado",
  },
  {
    id: "TCAN-02",
    nombre: "Paddle Muro Tradicional",
    deporte: "Paddle",
    superficie: "Cemento Poroso de alto agarre",
    tarifaBaseHora: 10000,
    duracionTurnoMin: 90,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    totalCanchasEnRed: 6,
    estado: "Habilitado",
  },
  {
    id: "TCAN-03",
    nombre: "Fútbol 5 Estadio FIFA Pro",
    deporte: "Fútbol 5",
    superficie: "Césped Sintético Monofilamento 50mm con caucho SBR",
    tarifaBaseHora: 22000,
    duracionTurnoMin: 60,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    totalCanchasEnRed: 8,
    estado: "Habilitado",
  },
  {
    id: "TCAN-04",
    nombre: "Fútbol 5 Auxiliar Techada",
    deporte: "Fútbol 5",
    superficie: "Césped Sintético Fibrilado 40mm",
    tarifaBaseHora: 19000,
    duracionTurnoMin: 60,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    totalCanchasEnRed: 5,
    estado: "Habilitado",
  },
  {
    id: "TCAN-05",
    nombre: "Tenis Polvo de Ladrillo Oficial",
    deporte: "Tenis",
    superficie: "Tierra Batida Roja con flejes de PVC",
    tarifaBaseHora: 14000,
    duracionTurnoMin: 90,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    totalCanchasEnRed: 3,
    estado: "Habilitado",
  },
];

// --- PL-01: PLANES DE MEMBRESÍA ---
export interface PlanMembresiaItem {
  id: string;
  nombre: string;
  periodicidad: "Mensual" | "Trimestral" | "Anual" | "Diario";
  precio: number;
  popular: boolean;
  beneficios: string[];
  sedesAcceso: "Multi-Sede Total (25+ Sedes)" | "Sede Única";
  descuentoCanchas: number;
  sociosInscriptos: number;
  estado: "Activo" | "Inactivo";
}

export const INITIAL_PLANES: PlanMembresiaItem[] = [
  {
    id: "PLAN-01",
    nombre: "Plan Anual Black VIP",
    periodicidad: "Anual",
    precio: 180000,
    popular: true,
    beneficios: [
      "Acceso ilimitado a las 25+ sedes de Entre Ríos (RF-03)",
      "15% de descuento en reserva de canchas de Paddle y Fútbol 5 (RF-11)",
      "Acceso irrestricto a todas las clases grupales",
      "Credencial QR con acceso rápido sin fila (RF-04)",
      "2 pases de invitado al mes gratis",
      "Evaluación física mensual y rutina personalizada",
    ],
    sedesAcceso: "Multi-Sede Total (25+ Sedes)",
    descuentoCanchas: 15,
    sociosInscriptos: 6420,
    estado: "Activo",
  },
  {
    id: "PLAN-02",
    nombre: "Plan Trimestral FitZone",
    periodicidad: "Trimestral",
    precio: 75000,
    popular: false,
    beneficios: [
      "Acceso libre multi-sede en toda la provincia",
      "15% de descuento en alquiler de canchas",
      "Todas las clases grupales incluidas",
      "QR dinámico en la App móvil",
      "1 pase de invitado al mes",
    ],
    sedesAcceso: "Multi-Sede Total (25+ Sedes)",
    descuentoCanchas: 15,
    sociosInscriptos: 4180,
    estado: "Activo",
  },
  {
    id: "PLAN-03",
    nombre: "Plan Mensual Pase Libre",
    periodicidad: "Mensual",
    precio: 28500,
    popular: false,
    beneficios: [
      "Acceso ilimitado al gimnasio y musculación",
      "Clases grupales regulares incluidas",
      "15% de descuento en reservas de canchas",
      "Acceso multi-sede",
    ],
    sedesAcceso: "Multi-Sede Total (25+ Sedes)",
    descuentoCanchas: 15,
    sociosInscriptos: 3950,
    estado: "Activo",
  },
  {
    id: "PLAN-04",
    nombre: "Pase Diario Entrenamiento",
    periodicidad: "Diario",
    precio: 6500,
    popular: false,
    beneficios: [
      "Pase por 1 día a sala de musculación y cardio",
      "Acceso a 1 clase grupal del día sujeta a cupo",
      "Sin descuento en canchas (aplica tarifa de cliente externo A2)",
    ],
    sedesAcceso: "Sede Única",
    descuentoCanchas: 0,
    sociosInscriptos: 854,
    estado: "Activo",
  },
];
