// ==========================================================================
// DATOS Y GESTIÓN DE CLASES, CANCHAS, LISTAS DE ESPERA Y RESERVAS (FASE 4)
// Sistema Centralizado para Front Estático FitZone (UNER Entre Ríos)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. TIPOS Y DATOS PARA CLASES (C-01, C-02, C-03)
// --------------------------------------------------------------------------
export interface ClaseItem {
  id: string;
  nombre: string;
  disciplina: string;
  instructor: string;
  sedeId: string;
  sedeNombre: string;
  sala: string;
  dias: ("Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado")[];
  horarioInicio: string; // ej. "08:00"
  horarioFin: string; // ej. "09:00"
  cupoMax: number;
  cupoActual: number;
  listaEsperaMax: number;
  nivel: "Todos los niveles" | "Principiante" | "Intermedio" | "Avanzado";
  intensidad: "Baja" | "Media" | "Alta" | "Extrema";
  estado: "Activa" | "Pausada" | "Cancelada";
  equipamiento: string[];
  descripcion: string;
  observaciones: string;
  colorBorder: string;
}

export const INITIAL_CLASES: ClaseItem[] = [
  {
    id: "CLS-01",
    nombre: "Spinning Pro Interval",
    disciplina: "Spinning Pro (Indoor Cycling)",
    instructor: "María José Ramos",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    sala: "Sala Ciclo Climatizada",
    dias: ["Lunes", "Miércoles", "Viernes"],
    horarioInicio: "08:00",
    horarioFin: "08:50",
    cupoMax: 20,
    cupoActual: 20,
    listaEsperaMax: 6,
    nivel: "Intermedio",
    intensidad: "Alta",
    estado: "Activa",
    equipamiento: ["Bicicletas magnéticas", "Monitor cardíaco", "Toalla obligatoria"],
    descripcion: "Entrenamiento cardiovascular en bicicleta fija con intervalos de potencia, subidas de montaña y sprints guiados por música.",
    observaciones: "Se requiere llegar 10 minutos antes para calibrar sillín y calas de pedales.",
    colorBorder: "border-orange",
  },
  {
    id: "CLS-02",
    nombre: "Power Yoga & Flex Vinyasa",
    disciplina: "Power Yoga & Flex",
    instructor: "Sofía Vergara",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    sala: "Estudio Zen",
    dias: ["Lunes", "Miércoles"],
    horarioInicio: "18:00",
    horarioFin: "19:00",
    cupoMax: 15,
    cupoActual: 13,
    listaEsperaMax: 5,
    nivel: "Todos los niveles",
    intensidad: "Media",
    estado: "Activa",
    equipamiento: ["Mats de yoga", "Bloques de corcho", "Correas de elongación"],
    descripcion: "Práctica dinámica que conecta respiración pranayama con transiciones asimétricas para ganar movilidad y fortaleza central.",
    observaciones: "Entrada sin calzado. Traer esterilla propia o solicitar una desinfectada en recepción.",
    colorBorder: "border-green",
  },
  {
    id: "CLS-03",
    nombre: "CrossFit WOD Elite Heavy",
    disciplina: "CrossFit WOD Elite",
    instructor: "Diego Arana",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    sala: "Box Central CrossFit",
    dias: ["Martes", "Jueves", "Sábado"],
    horarioInicio: "09:30",
    horarioFin: "10:30",
    cupoMax: 18,
    cupoActual: 18,
    listaEsperaMax: 8,
    nivel: "Avanzado",
    intensidad: "Extrema",
    estado: "Activa",
    equipamiento: ["Barras olímpicas", "Kettlebells 16-24kg", "Cajones pliométricos"],
    descripcion: "Bloque de fuerza máxima seguido por WOD contrarreloj por equipos con levantamiento y saltos gimnásticos.",
    observaciones: "Indispensable haber completado el taller On-Ramp de técnica básica.",
    colorBorder: "border-yellow",
  },
  {
    id: "CLS-04",
    nombre: "Box Fit Knockout Conditioning",
    disciplina: "Box Fit Knockout",
    instructor: "Martín Palermo",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    sala: "Ring & Training Functional",
    dias: ["Martes", "Jueves"],
    horarioInicio: "19:00",
    horarioFin: "19:55",
    cupoMax: 16,
    cupoActual: 14,
    listaEsperaMax: 5,
    nivel: "Todos los niveles",
    intensidad: "Alta",
    estado: "Activa",
    equipamiento: ["Guantines de boxeo", "Vendas elásticas", "Bolsas de cuero"],
    descripcion: "Circuitos de golpeo a bolsa con intervalos de cuerda y abdomen. Sin contacto entre participantes.",
    observaciones: "El uso de vendas elásticas es obligatorio para protección de muñecas.",
    colorBorder: "border-red",
  },
  {
    id: "CLS-05",
    nombre: "Pilates Reformer Precision",
    disciplina: "Pilates Reformer Studio",
    instructor: "Carla Méndez",
    sedeId: "concordia-costanera",
    sedeNombre: "Sede Concordia Costanera",
    sala: "Studio Reformer",
    dias: ["Lunes", "Miércoles", "Viernes"],
    horarioInicio: "17:30",
    horarioFin: "18:20",
    cupoMax: 8,
    cupoActual: 8,
    listaEsperaMax: 4,
    nivel: "Intermedio",
    intensidad: "Media",
    estado: "Activa",
    equipamiento: ["Camillas Reformer", "Resortes equilibrados", "Cajas y correas"],
    descripcion: "Entrenamiento de tonificación profunda del core, postura y estabilización lumbar.",
    observaciones: "Obligatorio uso de medias antideslizantes.",
    colorBorder: "border-red",
  },
  {
    id: "CLS-06",
    nombre: "Spinning Night Power Ride",
    disciplina: "Spinning Pro (Indoor Cycling)",
    instructor: "María José Ramos",
    sedeId: "concepcion-uruguay",
    sedeNombre: "Sede Concepción del Uruguay",
    sala: "Sala Ciclo 2",
    dias: ["Viernes"],
    horarioInicio: "19:30",
    horarioFin: "20:30",
    cupoMax: 20,
    cupoActual: 20,
    listaEsperaMax: 6,
    nivel: "Todos los niveles",
    intensidad: "Alta",
    estado: "Activa",
    equipamiento: ["Bicicletas fijas", "Luces rítmicas LED"],
    descripcion: "Sesión especial de viernes con playlist en vivo y luces nocturnas.",
    observaciones: "Cupos de alta rotación.",
    colorBorder: "border-orange",
  },
];

// --------------------------------------------------------------------------
// 2. TIPOS Y DATOS PARA LISTA DE ESPERA CONSOLIDADA (C-06)
// --------------------------------------------------------------------------
export interface WaitlistEntry {
  id: string;
  socioId: string;
  socioNombre: string;
  socioDni: string;
  socioTelefono: string;
  socioEmail: string;
  socioTipo: "Socio Activo" | "Socio Premium" | "Cliente Externo";
  socioAvatar: string;
  claseId: string;
  claseNombre: string;
  disciplina: string;
  sedeId: string;
  sedeNombre: string;
  dia: string;
  horario: string;
  instructor: string;
  posicion: number;
  fechaInscripcion: string;
  tiempoEsperaMinutos: number;
  estado: "En Espera" | "Promovido" | "Notificado" | "Cancelado";
  cuposOcupados: number;
  cuposMaximos: number;
}

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: "WL-001",
    socioId: "SOC-101",
    socioNombre: "Ignacio Pérez",
    socioDni: "35.882.910",
    socioTelefono: "+54 343 511-2299",
    socioEmail: "iperez@gmail.com",
    socioTipo: "Socio Activo",
    socioAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-01",
    claseNombre: "Spinning Pro Interval",
    disciplina: "Spinning Pro (Indoor Cycling)",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    dia: "Lunes",
    horario: "08:00 - 08:50",
    instructor: "María José Ramos",
    posicion: 1,
    fechaInscripcion: "14 Oct 2026, 06:45 hs",
    tiempoEsperaMinutos: 45,
    estado: "En Espera",
    cuposOcupados: 20,
    cuposMaximos: 20,
  },
  {
    id: "WL-002",
    socioId: "SOC-102",
    socioNombre: "Clara Varas",
    socioDni: "37.209.441",
    socioTelefono: "+54 343 490-1288",
    socioEmail: "cvaras@hotmail.com",
    socioTipo: "Socio Activo",
    socioAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-01",
    claseNombre: "Spinning Pro Interval",
    disciplina: "Spinning Pro (Indoor Cycling)",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    dia: "Lunes",
    horario: "08:00 - 08:50",
    instructor: "María José Ramos",
    posicion: 2,
    fechaInscripcion: "14 Oct 2026, 07:10 hs",
    tiempoEsperaMinutos: 20,
    estado: "En Espera",
    cuposOcupados: 20,
    cuposMaximos: 20,
  },
  {
    id: "WL-003",
    socioId: "SOC-103",
    socioNombre: "Esteban Rojas",
    socioDni: "32.190.874",
    socioTelefono: "+54 343 477-9900",
    socioEmail: "erojas@fitzone.org",
    socioTipo: "Socio Premium",
    socioAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-03",
    claseNombre: "CrossFit WOD Elite Heavy",
    disciplina: "CrossFit WOD Elite",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    dia: "Martes",
    horario: "09:30 - 10:30",
    instructor: "Diego Arana",
    posicion: 1,
    fechaInscripcion: "13 Oct 2026, 18:30 hs",
    tiempoEsperaMinutos: 90,
    estado: "En Espera",
    cuposOcupados: 18,
    cuposMaximos: 18,
  },
  {
    id: "WL-004",
    socioId: "SOC-104",
    socioNombre: "Carolina Mora",
    socioDni: "38.614.332",
    socioTelefono: "+54 345 422-5511",
    socioEmail: "caro.mora@gmail.com",
    socioTipo: "Socio Activo",
    socioAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-05",
    claseNombre: "Pilates Reformer Precision",
    disciplina: "Pilates Reformer Studio",
    sedeId: "concordia-costanera",
    sedeNombre: "Sede Concordia Costanera",
    dia: "Lunes",
    horario: "17:30 - 18:20",
    instructor: "Carla Méndez",
    posicion: 1,
    fechaInscripcion: "14 Oct 2026, 11:15 hs",
    tiempoEsperaMinutos: 150,
    estado: "En Espera",
    cuposOcupados: 8,
    cuposMaximos: 8,
  },
  {
    id: "WL-005",
    socioId: "SOC-105",
    socioNombre: "Tomás Bravo",
    socioDni: "39.400.119",
    socioTelefono: "+54 3442 41-7788",
    socioEmail: "tbravo@live.com",
    socioTipo: "Cliente Externo",
    socioAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-06",
    claseNombre: "Spinning Night Power Ride",
    disciplina: "Spinning Pro (Indoor Cycling)",
    sedeId: "concepcion-uruguay",
    sedeNombre: "Sede Concepción del Uruguay",
    dia: "Viernes",
    horario: "19:30 - 20:30",
    instructor: "María José Ramos",
    posicion: 1,
    fechaInscripcion: "14 Oct 2026, 12:00 hs",
    tiempoEsperaMinutos: 110,
    estado: "Notificado",
    cuposOcupados: 20,
    cuposMaximos: 20,
  },
  {
    id: "WL-006",
    socioId: "SOC-106",
    socioNombre: "Valeria Benítez",
    socioDni: "36.211.554",
    socioTelefono: "+54 343 456-7890",
    socioEmail: "vbenitez@gmail.com",
    socioTipo: "Socio Activo",
    socioAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    claseId: "CLS-03",
    claseNombre: "CrossFit WOD Elite Heavy",
    disciplina: "CrossFit WOD Elite",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    dia: "Martes",
    horario: "09:30 - 10:30",
    instructor: "Diego Arana",
    posicion: 2,
    fechaInscripcion: "13 Oct 2026, 19:10 hs",
    tiempoEsperaMinutos: 80,
    estado: "En Espera",
    cuposOcupados: 18,
    cuposMaximos: 18,
  },
];

// --------------------------------------------------------------------------
// 3. TIPOS Y DATOS PARA CANCHAS (CA-01, CA-02, CA-04)
// --------------------------------------------------------------------------
export interface CanchaItem {
  id: string;
  codigo: string;
  nombre: string;
  deporte: "Pádel" | "Fútbol 5" | "Tenis";
  sedeId: string;
  sedeNombre: string;
  tipoCanchaId: string;
  superficie: string;
  techada: boolean;
  iluminacion: "LED Profesional 400 Lux" | "LED Estándar" | "Halógena" | "Luz Natural";
  cerramiento: "Cristal Templado 12mm Panorámico" | "Muro de Cemento" | "Alambrado Olímpico 4m";
  dimensiones: string;
  capacidadJugadores: number;
  tarifaBaseHora: number;
  duracionTurnoMin: number;
  bufferEntreTurnosMin: number;
  descuentoSocioPorc: number;
  recargoHoraPicoPorc: number;
  estado: "Operativa" | "Mantenimiento" | "Fuera de Servicio";
  imagenUrl: string;
  fotos: string[];
  mantenimientoInfo?: {
    motivo: string;
    tecnico: string;
    fechaInicio: string;
    fechaEstimadaFin: string;
    tipoBloqueo: "Total" | "Parcial";
  };
  statsMes: {
    horasReservadas: number;
    ingresosTotales: number;
    tasaOcupacion: number;
    mantenimientosRealizados: number;
  };
  historialMantenimiento: {
    id: string;
    fecha: string;
    tipo: "Preventivo" | "Correctivo";
    descripcion: string;
    tecnico: string;
    costo: number;
    estado: "Completado" | "En Progreso";
  }[];
}

export const INITIAL_CANCHAS: CanchaItem[] = [
  {
    id: "CAN-PAD-01",
    codigo: "PAD-01",
    nombre: "Cancha Pádel 1 — Cristal Panorámico WPT",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    tipoCanchaId: "TCAN-01",
    superficie: "Césped Sintético Texturado Azul con arena de sílice",
    techada: true,
    iluminacion: "LED Profesional 400 Lux",
    cerramiento: "Cristal Templado 12mm Panorámico",
    dimensiones: "20.00m x 10.00m (Reglamentaria FIP)",
    capacidadJugadores: 4,
    tarifaBaseHora: 12000,
    duracionTurnoMin: 90,
    bufferEntreTurnosMin: 10,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Operativa",
    imagenUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    ],
    statsMes: {
      horasReservadas: 168,
      ingresosTotales: 1980000,
      tasaOcupacion: 88,
      mantenimientosRealizados: 1,
    },
    historialMantenimiento: [
      {
        id: "MNT-101",
        fecha: "02 Oct 2026",
        tipo: "Preventivo",
        descripcion: "Cepillado mecánico de césped y reposición de arena de sílice (100 kg)",
        tecnico: "Servicios Deportivos Del Litoral",
        costo: 85000,
        estado: "Completado",
      },
      {
        id: "MNT-098",
        fecha: "15 Sep 2026",
        tipo: "Correctivo",
        descripcion: "Ajuste de tensores de red y reemplazo de protectores de postes",
        tecnico: "Personal Mantenimiento Sede Central",
        costo: 32000,
        estado: "Completado",
      },
    ],
  },
  {
    id: "CAN-PAD-02",
    codigo: "PAD-02",
    nombre: "Cancha Pádel 2 — Cristal Estándar",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    tipoCanchaId: "TCAN-01",
    superficie: "Césped Sintético Verde 12mm",
    techada: true,
    iluminacion: "LED Profesional 400 Lux",
    cerramiento: "Cristal Templado 12mm Panorámico",
    dimensiones: "20.00m x 10.00m",
    capacidadJugadores: 4,
    tarifaBaseHora: 12000,
    duracionTurnoMin: 90,
    bufferEntreTurnosMin: 10,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Mantenimiento",
    imagenUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    ],
    mantenimientoInfo: {
      motivo: "Reemplazo de paño de red y ajuste de vidrio perimetral noroeste",
      tecnico: "Cristalería Entre Ríos S.R.L.",
      fechaInicio: "14 Oct 2026, 07:00 hs",
      fechaEstimadaFin: "15 Oct 2026, 18:00 hs",
      tipoBloqueo: "Total",
    },
    statsMes: {
      horasReservadas: 92,
      ingresosTotales: 1104000,
      tasaOcupacion: 55,
      mantenimientosRealizados: 2,
    },
    historialMantenimiento: [
      {
        id: "MNT-102",
        fecha: "14 Oct 2026",
        tipo: "Correctivo",
        descripcion: "Sustitución de anclaje de vidrio lateral por fisura superficial",
        tecnico: "Cristalería Entre Ríos S.R.L.",
        costo: 180000,
        estado: "En Progreso",
      },
    ],
  },
  {
    id: "CAN-PAD-03",
    codigo: "PAD-03",
    nombre: "Cancha Pádel 3 — Muro Tradicional",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    tipoCanchaId: "TCAN-02",
    superficie: "Cemento Poroso de alto agarre",
    techada: false,
    iluminacion: "LED Estándar",
    cerramiento: "Muro de Cemento",
    dimensiones: "20.00m x 10.00m",
    capacidadJugadores: 4,
    tarifaBaseHora: 10000,
    duracionTurnoMin: 90,
    bufferEntreTurnosMin: 10,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Operativa",
    imagenUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
    ],
    statsMes: {
      horasReservadas: 140,
      ingresosTotales: 1380000,
      tasaOcupacion: 74,
      mantenimientosRealizados: 1,
    },
    historialMantenimiento: [
      {
        id: "MNT-095",
        fecha: "20 Sep 2026",
        tipo: "Preventivo",
        descripcion: "Pintura antideslizante verde caucho en muros y piso",
        tecnico: "Pinturas Litoral",
        costo: 95000,
        estado: "Completado",
      },
    ],
  },
  {
    id: "CAN-FUT-01",
    codigo: "FUT-01",
    nombre: "Cancha Fútbol 5 — Estadio Central",
    deporte: "Fútbol 5",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    tipoCanchaId: "TCAN-03",
    superficie: "Césped Sintético Monofilamento 50mm con caucho SBR",
    techada: true,
    iluminacion: "LED Profesional 400 Lux",
    cerramiento: "Alambrado Olímpico 4m",
    dimensiones: "30.00m x 18.00m",
    capacidadJugadores: 10,
    tarifaBaseHora: 22000,
    duracionTurnoMin: 60,
    bufferEntreTurnosMin: 10,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Operativa",
    imagenUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80",
    ],
    statsMes: {
      horasReservadas: 190,
      ingresosTotales: 4180000,
      tasaOcupacion: 91,
      mantenimientosRealizados: 1,
    },
    historialMantenimiento: [
      {
        id: "MNT-090",
        fecha: "05 Oct 2026",
        tipo: "Preventivo",
        descripcion: "Descompactación y distribución de 300kg de caucho reciclado",
        tecnico: "Equipos Sintéticos SRL",
        costo: 120000,
        estado: "Completado",
      },
    ],
  },
  {
    id: "CAN-FUT-02",
    codigo: "FUT-02",
    nombre: "Cancha Fútbol 5 — Auxiliar Techada",
    deporte: "Fútbol 5",
    sedeId: "concordia-costanera",
    sedeNombre: "Sede Concordia Costanera",
    tipoCanchaId: "TCAN-03",
    superficie: "Césped Sintético 45mm",
    techada: true,
    iluminacion: "LED Estándar",
    cerramiento: "Alambrado Olímpico 4m",
    dimensiones: "28.00m x 16.00m",
    capacidadJugadores: 10,
    tarifaBaseHora: 20000,
    duracionTurnoMin: 60,
    bufferEntreTurnosMin: 10,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Operativa",
    imagenUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80",
    ],
    statsMes: {
      horasReservadas: 155,
      ingresosTotales: 3100000,
      tasaOcupacion: 78,
      mantenimientosRealizados: 0,
    },
    historialMantenimiento: [],
  },
  {
    id: "CAN-TEN-01",
    codigo: "TEN-01",
    nombre: "Cancha Tenis 1 — Polvo de Ladrillo Central",
    deporte: "Tenis",
    sedeId: "concordia-costanera",
    sedeNombre: "Sede Concordia Costanera",
    tipoCanchaId: "TCAN-04",
    superficie: "Tierra Batida Roja / Polvo de Ladrillo",
    techada: false,
    iluminacion: "LED Profesional 400 Lux",
    cerramiento: "Alambrado Olímpico 4m",
    dimensiones: "23.77m x 10.97m (Oficial ITF)",
    capacidadJugadores: 4,
    tarifaBaseHora: 15000,
    duracionTurnoMin: 90,
    bufferEntreTurnosMin: 15,
    descuentoSocioPorc: 15,
    recargoHoraPicoPorc: 20,
    estado: "Operativa",
    imagenUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
    ],
    statsMes: {
      horasReservadas: 110,
      ingresosTotales: 1650000,
      tasaOcupacion: 62,
      mantenimientosRealizados: 2,
    },
    historialMantenimiento: [
      {
        id: "MNT-089",
        fecha: "28 Sep 2026",
        tipo: "Preventivo",
        descripcion: "Riego, rodillo y reposición de 20 bolsas de polvo de ladrillo",
        tecnico: "Cancheros Club Concordia",
        costo: 65000,
        estado: "Completado",
      },
    ],
  },
];

// --------------------------------------------------------------------------
// 4. TIPOS Y DATOS PARA RESERVAS DE CANCHA (R-02, R-03, R-04)
// --------------------------------------------------------------------------
export interface ReservaItem {
  id: string;
  codigo: string;
  canchaId: string;
  canchaNombre: string;
  deporte: "Pádel" | "Fútbol 5" | "Tenis";
  sedeId: string;
  sedeNombre: string;
  fecha: string; // ej. "2026-10-14"
  horaInicio: string; // ej. "17:30"
  horaFin: string; // ej. "19:00"
  duracionMin: number;
  esHorarioPico: boolean;
  titular: {
    nombre: string;
    dni: string;
    telefono: string;
    email: string;
    esSocio: boolean;
    nroSocio?: string;
    categoriaSocio?: string;
  };
  jugadoresAcompaniantes: {
    nombre: string;
    dni?: string;
    esSocio?: boolean;
    checkIn: boolean;
  }[];
  tarifaBase: number;
  recargoPico: number;
  descuentoSocio: number;
  extras: {
    concepto: string;
    precio: number;
  }[];
  totalCalculado: number;
  montoAbonado: number;
  saldoPendiente: number;
  estadoPago: "Pagado" | "Seña 50%" | "Pendiente" | "Reembolsado";
  medioPago: "Mercado Pago" | "Tarjeta de Débito/Crédito" | "Efectivo" | "Transferencia Bancaria";
  nroComprobante?: string;
  estadoTurno: "Confirmado" | "En Juego" | "Finalizado" | "Cancelado" | "No Show";
  motivoCancelacion?: string;
  notas: string;
  fechaCreacion: string;
  historialAuditoria: {
    fecha: string;
    accion: string;
    usuario: string;
  }[];
}

export const INITIAL_RESERVAS: ReservaItem[] = [
  {
    id: "RSV-2026-081",
    codigo: "#RSV-081",
    canchaId: "CAN-PAD-01",
    canchaNombre: "Cancha Pádel 1 — Cristal Panorámico WPT",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    fecha: "2026-10-14",
    horaInicio: "17:30",
    horaFin: "19:00",
    duracionMin: 90,
    esHorarioPico: false,
    titular: {
      nombre: "Mateo Silva",
      dni: "38.102.994",
      telefono: "+54 343 512-8877",
      email: "msilva@gmail.com",
      esSocio: true,
      nroSocio: "SOC-0042",
      categoriaSocio: "Socio Activo Pleno",
    },
    jugadoresAcompaniantes: [
      { nombre: "Mateo Silva (Titular)", dni: "38.102.994", esSocio: true, checkIn: true },
      { nombre: "Rodrigo Morales", dni: "37.550.112", esSocio: false, checkIn: true },
      { nombre: "Lucas San Martín", dni: "39.400.912", esSocio: true, checkIn: false },
      { nombre: "Constanza Rivas", dni: "36.800.419", esSocio: true, checkIn: false },
    ],
    tarifaBase: 12000,
    recargoPico: 0,
    descuentoSocio: 1800, // 15%
    extras: [
      { concepto: "Alquiler 2 Paletas Bullpadel Pro", precio: 5000 },
      { concepto: "Tubo de pelotas Head Padel Pro S", precio: 3500 },
    ],
    totalCalculado: 18700,
    montoAbonado: 18700,
    saldoPendiente: 0,
    estadoPago: "Pagado",
    medioPago: "Mercado Pago",
    nroComprobante: "B-0004-00092101",
    estadoTurno: "En Juego",
    notas: "Solicitó paletas en recepción. Check-in de 2 jugadores registrado en molinete.",
    fechaCreacion: "12 Oct 2026, 14:20 hs",
    historialAuditoria: [
      { fecha: "12 Oct 2026, 14:20 hs", accion: "Reserva creada desde el portal web", usuario: "Mateo Silva (Socio)" },
      { fecha: "12 Oct 2026, 14:22 hs", accion: "Pago total confirmado vía Mercado Pago", usuario: "Pasarela Automática" },
      { fecha: "14 Oct 2026, 17:25 hs", accion: "Check-in presencial en recepción", usuario: "Lucas Benítez (Recepcionista)" },
    ],
  },
  {
    id: "RSV-2026-082",
    codigo: "#RSV-082",
    canchaId: "CAN-PAD-01",
    canchaNombre: "Cancha Pádel 1 — Cristal Panorámico WPT",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    fecha: "2026-10-14",
    horaInicio: "19:00",
    horaFin: "20:30",
    duracionMin: 90,
    esHorarioPico: true,
    titular: {
      nombre: "Esteban Rojas",
      dni: "32.190.874",
      telefono: "+54 343 477-9900",
      email: "erojas@fitzone.org",
      esSocio: false,
    },
    jugadoresAcompaniantes: [
      { nombre: "Esteban Rojas (Titular)", dni: "32.190.874", esSocio: false, checkIn: false },
      { nombre: "Martín Benavídez", dni: "33.400.119", esSocio: false, checkIn: false },
      { nombre: "Juan Pablo Castro", dni: "31.900.220", esSocio: false, checkIn: false },
      { nombre: "Nicolás Duarte", dni: "34.110.887", esSocio: false, checkIn: false },
    ],
    tarifaBase: 12000,
    recargoPico: 2400, // +20% pico
    descuentoSocio: 0,
    extras: [],
    totalCalculado: 14400,
    montoAbonado: 7200,
    saldoPendiente: 7200,
    estadoPago: "Seña 50%",
    medioPago: "Transferencia Bancaria",
    nroComprobante: "REC-0004-00018844",
    estadoTurno: "Confirmado",
    notas: "Abona seña del 50%. Debe liquidar el saldo de $7.200 al presentarse en mesa de entrada.",
    fechaCreacion: "13 Oct 2026, 10:15 hs",
    historialAuditoria: [
      { fecha: "13 Oct 2026, 10:15 hs", accion: "Reserva telefónica cargada en mostrador", usuario: "Lucas Benítez (Recepcionista)" },
      { fecha: "13 Oct 2026, 10:30 hs", accion: "Comprobante de seña 50% verificado", usuario: "Lucas Benítez (Recepcionista)" },
    ],
  },
  {
    id: "RSV-2026-083",
    codigo: "#RSV-083",
    canchaId: "CAN-PAD-03",
    canchaNombre: "Cancha Pádel 3 — Muro Tradicional",
    deporte: "Pádel",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    fecha: "2026-10-14",
    horaInicio: "16:00",
    horaFin: "17:30",
    duracionMin: 90,
    esHorarioPico: false,
    titular: {
      nombre: "Constanza Rivas",
      dni: "36.800.419",
      telefono: "+54 343 514-9922",
      email: "crivas@fibertel.com.ar",
      esSocio: true,
      nroSocio: "SOC-0078",
      categoriaSocio: "Socio Activo",
    },
    jugadoresAcompaniantes: [
      { nombre: "Constanza Rivas", esSocio: true, checkIn: true },
      { nombre: "Isabel Fuentes", esSocio: true, checkIn: true },
      { nombre: "Valentina Rossi", esSocio: true, checkIn: true },
      { nombre: "Francisca Soto", esSocio: true, checkIn: true },
    ],
    tarifaBase: 10000,
    recargoPico: 0,
    descuentoSocio: 1500, // 15%
    extras: [],
    totalCalculado: 8500,
    montoAbonado: 8500,
    saldoPendiente: 0,
    estadoPago: "Pagado",
    medioPago: "Tarjeta de Débito/Crédito",
    nroComprobante: "B-0004-00092080",
    estadoTurno: "Finalizado",
    notas: "Turno concluido sin incidencias técnicas.",
    fechaCreacion: "11 Oct 2026, 16:00 hs",
    historialAuditoria: [
      { fecha: "11 Oct 2026, 16:00 hs", accion: "Reserva confirmada online", usuario: "Constanza Rivas" },
      { fecha: "14 Oct 2026, 17:30 hs", accion: "Turno finalizado en sistema", usuario: "Automático" },
    ],
  },
  {
    id: "RSV-2026-084",
    codigo: "#RSV-084",
    canchaId: "CAN-FUT-01",
    canchaNombre: "Cancha Fútbol 5 — Estadio Central",
    deporte: "Fútbol 5",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    fecha: "2026-10-14",
    horaInicio: "18:30",
    horaFin: "19:30",
    duracionMin: 60,
    esHorarioPico: false,
    titular: {
      nombre: "Equipo Los Galácticos (Cap. Javier Gómez)",
      dni: "30.412.980",
      telefono: "+54 343 420-1133",
      email: "javier.gomez@galacticos.com",
      esSocio: false,
    },
    jugadoresAcompaniantes: [
      { nombre: "Javier Gómez", checkIn: false },
      { nombre: "9 Jugadores invitados", checkIn: false },
    ],
    tarifaBase: 22000,
    recargoPico: 0,
    descuentoSocio: 0,
    extras: [
      { concepto: "Juego de 10 pecheras numeradas flúor", precio: 2000 },
    ],
    totalCalculado: 24000,
    montoAbonado: 24000,
    saldoPendiente: 0,
    estadoPago: "Pagado",
    medioPago: "Efectivo",
    nroComprobante: "FAC-0004-00011290",
    estadoTurno: "Confirmado",
    notas: "Cobrado en recepción en efectivo. Requieren balón oficial nro 4 medio pique.",
    fechaCreacion: "10 Oct 2026, 19:40 hs",
    historialAuditoria: [
      { fecha: "10 Oct 2026, 19:40 hs", accion: "Reserva mostrador", usuario: "Lucas Benítez (Recepcionista)" },
    ],
  },
  {
    id: "RSV-2026-085",
    codigo: "#RSV-085",
    canchaId: "CAN-FUT-01",
    canchaNombre: "Cancha Fútbol 5 — Estadio Central",
    deporte: "Fútbol 5",
    sedeId: "parana-centro",
    sedeNombre: "Sede Paraná Centro (Central)",
    fecha: "2026-10-14",
    horaInicio: "20:00",
    horaFin: "21:00",
    duracionMin: 60,
    esHorarioPico: true,
    titular: {
      nombre: "Torneo Empresarial Banco Entre Ríos",
      dni: "30-50001092-4",
      telefono: "+54 343 420-9000",
      email: "rrhh@bancoentrerios.com.ar",
      esSocio: true,
      nroSocio: "EMP-0012",
      categoriaSocio: "Convenio Corporativo",
    },
    jugadoresAcompaniantes: [
      { nombre: "10 Jugadores Corporativos", checkIn: false },
    ],
    tarifaBase: 22000,
    recargoPico: 4400, // +20% pico
    descuentoSocio: 3300, // -15% convenio
    extras: [],
    totalCalculado: 23100,
    montoAbonado: 23100,
    saldoPendiente: 0,
    estadoPago: "Pagado",
    medioPago: "Transferencia Bancaria",
    nroComprobante: "FAC-A-0004-00000412",
    estadoTurno: "Confirmado",
    notas: "Factura A corporativa enviada a tesorería.",
    fechaCreacion: "05 Oct 2026, 11:00 hs",
    historialAuditoria: [
      { fecha: "05 Oct 2026, 11:00 hs", accion: "Reserva corporativa asignada", usuario: "Valeria Morales (Gerente)" },
    ],
  },
  {
    id: "RSV-2026-086",
    codigo: "#RSV-086",
    canchaId: "CAN-TEN-01",
    canchaNombre: "Cancha Tenis 1 — Polvo de Ladrillo Central",
    deporte: "Tenis",
    sedeId: "concordia-costanera",
    sedeNombre: "Sede Concordia Costanera",
    fecha: "2026-10-14",
    horaInicio: "17:30",
    horaFin: "19:00",
    duracionMin: 90,
    esHorarioPico: false,
    titular: {
      nombre: "Prof. Ricardo Garín",
      dni: "25.109.840",
      telefono: "+54 345 422-9901",
      email: "rgarin@tenisclub.com",
      esSocio: true,
      nroSocio: "SOC-0105",
      categoriaSocio: "Socio Activo",
    },
    jugadoresAcompaniantes: [
      { nombre: "Prof. Ricardo Garín", checkIn: true },
      { nombre: "Alumno Tenis", checkIn: true },
    ],
    tarifaBase: 15000,
    recargoPico: 0,
    descuentoSocio: 2250, // -15%
    extras: [],
    totalCalculado: 12750,
    montoAbonado: 12750,
    saldoPendiente: 0,
    estadoPago: "Pagado",
    medioPago: "Mercado Pago",
    nroComprobante: "B-0005-00033100",
    estadoTurno: "Finalizado",
    notas: "Clase particular de tenis.",
    fechaCreacion: "13 Oct 2026, 09:15 hs",
    historialAuditoria: [
      { fecha: "13 Oct 2026, 09:15 hs", accion: "Reserva confirmada", usuario: "Ricardo Garín" },
    ],
  },
];

// --------------------------------------------------------------------------
// 5. ESTADO EN MEMORIA Y MÉTODOS DE CONSULTA / MUTACIÓN
// --------------------------------------------------------------------------
let clasesMemoryState: ClaseItem[] = [...INITIAL_CLASES];
let waitlistMemoryState: WaitlistEntry[] = [...INITIAL_WAITLIST];
let canchasMemoryState: CanchaItem[] = [...INITIAL_CANCHAS];
let reservasMemoryState: ReservaItem[] = [...INITIAL_RESERVAS];

// --- Clases ---
export function getClases(): ClaseItem[] {
  return clasesMemoryState;
}

export function getClaseById(id: string): ClaseItem | undefined {
  return clasesMemoryState.find((c) => c.id === id);
}

export function saveClase(clase: ClaseItem): void {
  const index = clasesMemoryState.findIndex((c) => c.id === clase.id);
  if (index >= 0) {
    clasesMemoryState[index] = clase;
  } else {
    clasesMemoryState = [clase, ...clasesMemoryState];
  }
}

// --- Lista de Espera ---
export function getWaitlist(): WaitlistEntry[] {
  return waitlistMemoryState;
}

export function promoteWaitlistMember(waitlistId: string): boolean {
  const index = waitlistMemoryState.findIndex((w) => w.id === waitlistId);
  if (index >= 0) {
    waitlistMemoryState[index] = {
      ...waitlistMemoryState[index],
      estado: "Promovido",
    };
    return true;
  }
  return false;
}

export function notifyWaitlistMember(waitlistId: string): boolean {
  const index = waitlistMemoryState.findIndex((w) => w.id === waitlistId);
  if (index >= 0) {
    waitlistMemoryState[index] = {
      ...waitlistMemoryState[index],
      estado: "Notificado",
    };
    return true;
  }
  return false;
}

export function cancelWaitlistMember(waitlistId: string): boolean {
  const index = waitlistMemoryState.findIndex((w) => w.id === waitlistId);
  if (index >= 0) {
    waitlistMemoryState[index] = {
      ...waitlistMemoryState[index],
      estado: "Cancelado",
    };
    return true;
  }
  return false;
}

// --- Canchas ---
export function getCanchas(): CanchaItem[] {
  return canchasMemoryState;
}

export function getCanchaById(id: string): CanchaItem | undefined {
  return canchasMemoryState.find((c) => c.id === id || c.codigo.toLowerCase() === id.toLowerCase());
}

export function saveCancha(cancha: CanchaItem): void {
  const index = canchasMemoryState.findIndex((c) => c.id === cancha.id);
  if (index >= 0) {
    canchasMemoryState[index] = cancha;
  } else {
    canchasMemoryState = [cancha, ...canchasMemoryState];
  }
}

// --- Reservas ---
export function getReservas(): ReservaItem[] {
  return reservasMemoryState;
}

export function getReservaById(id: string): ReservaItem | undefined {
  return reservasMemoryState.find((r) => r.id === id || r.codigo.replace("#", "") === id.replace("#", ""));
}

export function saveReserva(reserva: ReservaItem): void {
  const index = reservasMemoryState.findIndex((r) => r.id === reserva.id);
  if (index >= 0) {
    reservasMemoryState[index] = reserva;
  } else {
    reservasMemoryState = [reserva, ...reservasMemoryState];
  }
}

export function cancelReserva(reservaId: string, motivo: string): boolean {
  const index = reservasMemoryState.findIndex((r) => r.id === reservaId);
  if (index >= 0) {
    reservasMemoryState[index] = {
      ...reservasMemoryState[index],
      estadoTurno: "Cancelado",
      estadoPago: "Reembolsado",
      motivoCancelacion: motivo,
      historialAuditoria: [
        ...reservasMemoryState[index].historialAuditoria,
        {
          fecha: new Date().toLocaleDateString("es-AR") + ", " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs",
          accion: `Reserva cancelada: ${motivo}`,
          usuario: "Panel Administrativo",
        },
      ],
    };
    return true;
  }
  return false;
}

export function checkInJugador(reservaId: string, jugadorIndex: number): boolean {
  const index = reservasMemoryState.findIndex((r) => r.id === reservaId);
  if (index >= 0) {
    const r = reservasMemoryState[index];
    const updatedJugadores = [...r.jugadoresAcompaniantes];
    if (updatedJugadores[jugadorIndex]) {
      updatedJugadores[jugadorIndex] = {
        ...updatedJugadores[jugadorIndex],
        checkIn: !updatedJugadores[jugadorIndex].checkIn,
      };
      reservasMemoryState[index] = {
        ...r,
        jugadoresAcompaniantes: updatedJugadores,
      };
      return true;
    }
  }
  return false;
}

export function registrarCobroSaldo(reservaId: string): boolean {
  const index = reservasMemoryState.findIndex((r) => r.id === reservaId);
  if (index >= 0) {
    const r = reservasMemoryState[index];
    reservasMemoryState[index] = {
      ...r,
      montoAbonado: r.totalCalculado,
      saldoPendiente: 0,
      estadoPago: "Pagado",
      historialAuditoria: [
        ...r.historialAuditoria,
        {
          fecha: new Date().toLocaleDateString("es-AR") + ", " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs",
          accion: `Cobro de saldo ($${r.saldoPendiente.toLocaleString()}) registrado con éxito`,
          usuario: "Recepción",
        },
      ],
    };
    return true;
  }
  return false;
}
