// Seed de base de datos con datos completos para probar todos los endpoints del backend.
// Uso: npm run seed  (o node prisma/seed.mjs)
// Es idempotente: puede ejecutarse múltiples veces sin duplicar registros ni romper foreign keys.
//
// Carga: 26 sedes, cada una con canchas de Paddle, Fútbol 5 y Tenis + 3 clases con horarios.
//
// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS DE PRUEBA (copiar al README)
//
// Perfil                                  | Rol (BD)      | Email                          | Contraseña
// ----------------------------------------|---------------|--------------------------------|----------------
// Gerente central                         | Gerente       | admin@fitzone.com              | Admin123!
// Recepcionista / admin de sede (Centro)  | Administrador | recepcion.centro@fitzone.com   | Recepcion123!
// Socio activo (membresía ACTIVO)         | Cliente       | carlos.cliente@fitzone.com     | Cliente123!
// Cliente externo (sin membresía)         | Cliente       | externo@fitzone.com            | Externo123!
// Socio en mora (membresía VENCIDO, RN-03)| Cliente       | mora@fitzone.com               | Mora123!
// Socio con pago pendiente (PENDIENTE_PAGO)| Cliente      | ana@fitzone.com                | MiClaveSegura1
// Instructor                              | Instructor    | laura.instructor@fitzone.com   | Instructor123!
//
// Nota: el modelo no tiene tipo "socio"/"cliente externo". Ambos usan el rol
// "Cliente"; es SOCIO quien tiene una membresía (activa o vencida) y es CLIENTE
// EXTERNO quien no tiene ninguna.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

try {
  process.loadEnvFile(); // carga backend/.env (Node 20+)
} catch {
  // sin .env: se usan las variables del entorno
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos de prueba (Seed)...');

  // ==========================================
  // 1. ROLES
  // ==========================================
  console.log('➜ Creando roles...');
  const rolesData = ['Cliente', 'Instructor', 'Gerente', 'Administrador'];
  const roles = {};

  for (const nombreRol of rolesData) {
    const rol = await prisma.rol.upsert({
      where: { clase_rol: nombreRol },
      update: {},
      create: { clase_rol: nombreRol },
    });
    roles[nombreRol] = rol;
  }

  // ==========================================
  // 2. SEDES
  // ==========================================
  console.log('➜ Creando sedes...');
  const sedeCentro = await prisma.sede.upsert({
    where: { nombre: 'FitZone Concordia Centro' },
    update: {
      direccion: 'Av. Siempre Viva 123',
      localidad: 'Concordia',
      aforo_maximo: 80,
    },
    create: {
      nombre: 'FitZone Concordia Centro',
      direccion: 'Av. Siempre Viva 123',
      localidad: 'Concordia',
      aforo_maximo: 80,
    },
  });

  const sedeCostanera = await prisma.sede.upsert({
    where: { nombre: 'FitZone Costanera' },
    update: {
      direccion: 'Costanera Sur 450',
      localidad: 'Concordia',
      aforo_maximo: 120,
    },
    create: {
      nombre: 'FitZone Costanera',
      direccion: 'Costanera Sur 450',
      localidad: 'Concordia',
      aforo_maximo: 120,
    },
  });

  // Sedes adicionales hasta superar las 25 requeridas (24 extra + las 2 anteriores = 26)
  const sedesExtra = [
    ['FitZone Buenos Aires Palermo', 'Av. Santa Fe 3200', 'Buenos Aires', 150],
    ['FitZone Buenos Aires Belgrano', 'Av. Cabildo 2100', 'Buenos Aires', 140],
    ['FitZone Buenos Aires Caballito', 'Av. Rivadavia 5100', 'Buenos Aires', 130],
    ['FitZone Córdoba Nueva Córdoba', 'Obispo Trejo 800', 'Córdoba', 110],
    ['FitZone Córdoba Cerro', 'Av. Colón 4500', 'Córdoba', 100],
    ['FitZone Rosario Centro', 'Calle Córdoba 1500', 'Rosario', 120],
    ['FitZone Rosario Fisherton', 'Eva Perón 7800', 'Rosario', 90],
    ['FitZone Mendoza Centro', 'Av. San Martín 1200', 'Mendoza', 100],
    ['FitZone Mendoza Godoy Cruz', 'Av. San Martín Sur 900', 'Mendoza', 85],
    ['FitZone La Plata Centro', 'Calle 7 N° 650', 'La Plata', 95],
    ['FitZone Tucumán Centro', 'Av. Mate de Luna 1800', 'San Miguel de Tucumán', 90],
    ['FitZone Salta Centro', 'Av. Belgrano 700', 'Salta', 80],
    ['FitZone Mar del Plata Centro', 'Av. Luro 3300', 'Mar del Plata', 110],
    ['FitZone Mar del Plata Güemes', 'Güemes 2700', 'Mar del Plata', 75],
    ['FitZone Neuquén Centro', 'Av. Argentina 400', 'Neuquén', 70],
    ['FitZone Paraná Centro', 'Av. Rivadavia 250', 'Paraná', 70],
    ['FitZone Santa Fe Centro', 'San Martín 2600', 'Santa Fe', 85],
    ['FitZone Corrientes Centro', 'Av. Costanera 1100', 'Corrientes', 65],
    ['FitZone Posadas Centro', 'Av. Mitre 1500', 'Posadas', 65],
    ['FitZone Bahía Blanca Centro', 'Calle Alsina 300', 'Bahía Blanca', 80],
    ['FitZone San Juan Centro', 'Av. Libertador 900', 'San Juan', 70],
    ['FitZone Ushuaia Centro', 'Av. Maipú 800', 'Ushuaia', 50],
    ['FitZone Bariloche Centro', 'Av. Bustillo 1300', 'San Carlos de Bariloche', 60],
    ['FitZone Concordia Norte', 'Av. Yrigoyen 2200', 'Concordia', 75],
  ];

  const todasLasSedes = [sedeCentro, sedeCostanera];
  for (const [nombre, direccion, localidad, aforo_maximo] of sedesExtra) {
    const sede = await prisma.sede.upsert({
      where: { nombre },
      update: { direccion, localidad, aforo_maximo },
      create: { nombre, direccion, localidad, aforo_maximo },
    });
    todasLasSedes.push(sede);
  }
  console.log(`   ${todasLasSedes.length} sedes cargadas.`);

  // ==========================================
  // 3. TIPOS DE CANCHA
  // ==========================================
  console.log('➜ Creando tipos de cancha...');
  const tipoPaddle = await prisma.tipo_cancha.upsert({
    where: { nombre: 'Paddle' },
    update: {},
    create: { nombre: 'Paddle' },
  });

  const tipoFutbol = await prisma.tipo_cancha.upsert({
    where: { nombre: 'Fútbol 5' },
    update: {},
    create: { nombre: 'Fútbol 5' },
  });

  const tipoTenis = await prisma.tipo_cancha.upsert({
    where: { nombre: 'Tenis' },
    update: {},
    create: { nombre: 'Tenis' },
  });

  // ==========================================
  // 4. CANCHAS
  // ==========================================
  console.log('➜ Creando canchas...');
  const canchaPaddle = await prisma.cancha.upsert({
    where: {
      sede_id_nombre: {
        sede_id: sedeCentro.id,
        nombre: 'Cancha 1 (Paddle)',
      },
    },
    update: {
      costo_hora: 8000.0,
      estado: 'HABILITADA',
    },
    create: {
      sede_id: sedeCentro.id,
      tipo_cancha_id: tipoPaddle.id,
      nombre: 'Cancha 1 (Paddle)',
      costo_hora: 8000.0,
      estado: 'HABILITADA',
    },
  });

  const canchaFutbol = await prisma.cancha.upsert({
    where: {
      sede_id_nombre: {
        sede_id: sedeCentro.id,
        nombre: 'Cancha 2 (Fútbol 5)',
      },
    },
    update: {
      costo_hora: 15000.0,
      estado: 'HABILITADA',
    },
    create: {
      sede_id: sedeCentro.id,
      tipo_cancha_id: tipoFutbol.id,
      nombre: 'Cancha 2 (Fútbol 5)',
      costo_hora: 15000.0,
      estado: 'HABILITADA',
    },
  });

  const canchaMantenimiento = await prisma.cancha.upsert({
    where: {
      sede_id_nombre: {
        sede_id: sedeCentro.id,
        nombre: 'Cancha 3 (Mantenimiento)',
      },
    },
    update: {
      costo_hora: 8000.0,
      estado: 'EN_MANTENIMIENTO',
    },
    create: {
      sede_id: sedeCentro.id,
      tipo_cancha_id: tipoPaddle.id,
      nombre: 'Cancha 3 (Mantenimiento)',
      costo_hora: 8000.0,
      estado: 'EN_MANTENIMIENTO',
    },
  });

  // Canchas de todas las sedes: Paddle, Fútbol 5 y Tenis en cada una (idempotente por sede+nombre)
  const canchasPorSede = [
    { nombre: 'Paddle 1', tipo: tipoPaddle, costo: 8000.0 },
    { nombre: 'Fútbol 5 1', tipo: tipoFutbol, costo: 15000.0 },
    { nombre: 'Tenis 1', tipo: tipoTenis, costo: 10000.0 },
  ];
  for (const sede of todasLasSedes) {
    for (const c of canchasPorSede) {
      await prisma.cancha.upsert({
        where: { sede_id_nombre: { sede_id: sede.id, nombre: c.nombre } },
        update: { costo_hora: c.costo, estado: 'HABILITADA' },
        create: {
          sede_id: sede.id,
          tipo_cancha_id: c.tipo.id,
          nombre: c.nombre,
          costo_hora: c.costo,
          estado: 'HABILITADA',
        },
      });
    }
  }

  // ==========================================
  // 5. TIPOS DE CLASE
  // ==========================================
  console.log('➜ Creando tipos de clase...');
  const tipoSpinning = await prisma.tipo_clase.upsert({
    where: { nombre: 'Spinning' },
    update: {},
    create: { nombre: 'Spinning' },
  });

  const tipoYoga = await prisma.tipo_clase.upsert({
    where: { nombre: 'Yoga' },
    update: {},
    create: { nombre: 'Yoga' },
  });

  const tipoCrossFit = await prisma.tipo_clase.upsert({
    where: { nombre: 'CrossFit' },
    update: {},
    create: { nombre: 'CrossFit' },
  });

  // ==========================================
  // 6. PLANES DE MEMBRESÍA
  // ==========================================
  console.log('➜ Creando planes de membresía...');
  const planMensual = await prisma.plan_membresia.upsert({
    where: { nombre: 'Mensual' },
    update: { duracion_meses: 1, precio: 15000.0 },
    create: { nombre: 'Mensual', duracion_meses: 1, precio: 15000.0 },
  });

  const planTrimestral = await prisma.plan_membresia.upsert({
    where: { nombre: 'Trimestral' },
    update: { duracion_meses: 3, precio: 40000.0 },
    create: { nombre: 'Trimestral', duracion_meses: 3, precio: 40000.0 },
  });

  const planAnual = await prisma.plan_membresia.upsert({
    where: { nombre: 'Anual' },
    update: { duracion_meses: 12, precio: 140000.0 },
    create: { nombre: 'Anual', duracion_meses: 12, precio: 140000.0 },
  });

  // ==========================================
  // 7. USUARIOS DE PRUEBA
  // ==========================================
  console.log('➜ Creando usuarios de prueba...');
  const hashAdmin = await bcrypt.hash('Admin123!', 10);
  const hashInstructor = await bcrypt.hash('Instructor123!', 10);
  const hashCarlos = await bcrypt.hash('Cliente123!', 10);
  const hashAna = await bcrypt.hash('MiClaveSegura1', 10);

  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@fitzone.com' },
    update: { password_hash: hashAdmin, id_rol: roles['Gerente'].id_rol },
    create: {
      dni: '30000001',
      nombre: 'Admin',
      apellido: 'FitZone',
      email: 'admin@fitzone.com',
      telefono: '3454111111',
      foto_url: 'https://fitzone.com/fotos/admin.jpg',
      id_rol: roles['Gerente'].id_rol,
      sede_base_id: sedeCentro.id,
      password_hash: hashAdmin,
    },
  });

  const instructorUser = await prisma.usuario.upsert({
    where: { email: 'laura.instructor@fitzone.com' },
    update: { password_hash: hashInstructor, id_rol: roles['Instructor'].id_rol },
    create: {
      dni: '30000002',
      nombre: 'Laura',
      apellido: 'Paz',
      email: 'laura.instructor@fitzone.com',
      telefono: '3454222222',
      foto_url: 'https://fitzone.com/fotos/laura.jpg',
      id_rol: roles['Instructor'].id_rol,
      sede_base_id: sedeCentro.id,
      password_hash: hashInstructor,
    },
  });

  const carlosUser = await prisma.usuario.upsert({
    where: { email: 'carlos.cliente@fitzone.com' },
    update: { password_hash: hashCarlos, id_rol: roles['Cliente'].id_rol },
    create: {
      dni: '30000003',
      nombre: 'Carlos',
      apellido: 'Gómez',
      email: 'carlos.cliente@fitzone.com',
      telefono: '3454333333',
      foto_url: 'https://fitzone.com/fotos/carlos.jpg',
      id_rol: roles['Cliente'].id_rol,
      sede_base_id: sedeCentro.id,
      password_hash: hashCarlos,
    },
  });

  const anaUser = await prisma.usuario.upsert({
    where: { email: 'ana@fitzone.com' },
    update: { password_hash: hashAna, id_rol: roles['Cliente'].id_rol },
    create: {
      dni: '30000004',
      nombre: 'Ana',
      apellido: 'Fernández',
      email: 'ana@fitzone.com',
      telefono: '3454444444',
      foto_url: 'https://fitzone.com/fotos/ana.jpg',
      id_rol: roles['Cliente'].id_rol,
      sede_base_id: sedeCostanera.id,
      password_hash: hashAna,
    },
  });

  // Recepcionista / administrador de sede (rol Administrador, sede Centro)
  const hashRecepcion = await bcrypt.hash('Recepcion123!', 10);
  await prisma.usuario.upsert({
    where: { email: 'recepcion.centro@fitzone.com' },
    update: { password_hash: hashRecepcion, id_rol: roles['Administrador'].id_rol },
    create: {
      dni: '30000005',
      nombre: 'Romina',
      apellido: 'Recepción',
      email: 'recepcion.centro@fitzone.com',
      telefono: '3454555555',
      id_rol: roles['Administrador'].id_rol,
      sede_base_id: sedeCentro.id,
      password_hash: hashRecepcion,
    },
  });

  // Cliente externo (rol Cliente, sin membresía)
  const hashExterno = await bcrypt.hash('Externo123!', 10);
  await prisma.usuario.upsert({
    where: { email: 'externo@fitzone.com' },
    update: { password_hash: hashExterno, id_rol: roles['Cliente'].id_rol },
    create: {
      dni: '30000006',
      nombre: 'Esteban',
      apellido: 'Externo',
      email: 'externo@fitzone.com',
      telefono: '3454666666',
      id_rol: roles['Cliente'].id_rol,
      sede_base_id: sedeCentro.id,
      password_hash: hashExterno,
    },
  });

  // Socio en mora (rol Cliente, membresía VENCIDO) para probar RN-03
  const hashMora = await bcrypt.hash('Mora123!', 10);
  const moraUser = await prisma.usuario.upsert({
    where: { email: 'mora@fitzone.com' },
    update: { password_hash: hashMora, id_rol: roles['Cliente'].id_rol },
    create: {
      dni: '30000007',
      nombre: 'Martín',
      apellido: 'Moroso',
      email: 'mora@fitzone.com',
      telefono: '3454777777',
      id_rol: roles['Cliente'].id_rol,
      sede_base_id: sedeCostanera.id,
      password_hash: hashMora,
    },
  });

  // ==========================================
  // 8. PERFIL DE INSTRUCTOR
  // ==========================================
  console.log('➜ Asociando perfil de instructor...');
  const instructorProfile = await prisma.instructor.upsert({
    where: { usuario_id: instructorUser.id },
    update: {},
    create: { usuario_id: instructorUser.id },
  });

  // ==========================================
  // 9. CREDENCIALES QR
  // ==========================================
  console.log('➜ Creando credenciales QR...');
  await prisma.credencial_qr.upsert({
    where: { usuario_id: carlosUser.id },
    update: { secreto: 'qr_secret_carlos_demo' },
    create: { usuario_id: carlosUser.id, secreto: 'qr_secret_carlos_demo' },
  });

  await prisma.credencial_qr.upsert({
    where: { usuario_id: anaUser.id },
    update: { secreto: 'qr_secret_ana_demo' },
    create: { usuario_id: anaUser.id, secreto: 'qr_secret_ana_demo' },
  });

  // ==========================================
  // 10. CLASES PROGRAMADAS
  // ==========================================
  console.log('➜ Creando clases programadas...');
  const inicioClase1 = new Date();
  inicioClase1.setDate(inicioClase1.getDate() + 1);
  inicioClase1.setHours(18, 0, 0, 0);

  const finClase1 = new Date(inicioClase1);
  finClase1.setHours(19, 0, 0, 0);

  const inicioClase2 = new Date();
  inicioClase2.setDate(inicioClase2.getDate() + 1);
  inicioClase2.setHours(19, 30, 0, 0);

  const finClase2 = new Date(inicioClase2);
  finClase2.setHours(20, 30, 0, 0);

  // Clase con cupo disponible (Spinning)
  let claseConCupo = await prisma.clase.findFirst({
    where: {
      sede_id: sedeCentro.id,
      tipo_clase_id: tipoSpinning.id,
      instructor_id: instructorProfile.id,
    },
  });

  if (!claseConCupo) {
    claseConCupo = await prisma.clase.create({
      data: {
        sede_id: sedeCentro.id,
        tipo_clase_id: tipoSpinning.id,
        instructor_id: instructorProfile.id,
        inicio_at: inicioClase1,
        fin_at: finClase1,
        capacidad_maxima: 20,
        cupo_disponible: 19,
      },
    });
  }

  // Clase llena (Yoga) - para probar lista de espera
  let claseLlena = await prisma.clase.findFirst({
    where: {
      sede_id: sedeCentro.id,
      tipo_clase_id: tipoYoga.id,
      instructor_id: instructorProfile.id,
    },
  });

  if (!claseLlena) {
    claseLlena = await prisma.clase.create({
      data: {
        sede_id: sedeCentro.id,
        tipo_clase_id: tipoYoga.id,
        instructor_id: instructorProfile.id,
        inicio_at: inicioClase2,
        fin_at: finClase2,
        capacidad_maxima: 15,
        cupo_disponible: 0,
      },
    });
  }

  // Clases en todas las sedes: 3 por sede (Spinning, Yoga, CrossFit) con horarios escalonados por sede.
  // Para Centro, Spinning y Yoga ya existen (arriba) y solo se agrega CrossFit.
  const tiposClaseSede = [
    { tipo: tipoSpinning, horaInicio: 8, capacidad: 20 },
    { tipo: tipoYoga, horaInicio: 12, capacidad: 15 },
    { tipo: tipoCrossFit, horaInicio: 18, capacidad: 12 },
  ];
  for (const [indiceSede, sede] of todasLasSedes.entries()) {
    for (const t of tiposClaseSede) {
      const existente = await prisma.clase.findFirst({
        where: { sede_id: sede.id, tipo_clase_id: t.tipo.id },
      });
      if (existente) continue;

      // Escalonamos los minutos según la sede (0, 15, 30, 45) para variar horarios
      const inicio = new Date();
      inicio.setDate(inicio.getDate() + 1);
      inicio.setHours(t.horaInicio, (indiceSede % 4) * 15, 0, 0);
      const fin = new Date(inicio);
      fin.setHours(inicio.getHours() + 1);

      await prisma.clase.create({
        data: {
          sede_id: sede.id,
          tipo_clase_id: t.tipo.id,
          instructor_id: instructorProfile.id,
          inicio_at: inicio,
          fin_at: fin,
          capacidad_maxima: t.capacidad,
          cupo_disponible: t.capacidad,
        },
      });
    }
  }

  // ==========================================
  // 11. MEMBRESÍAS
  // ==========================================
  console.log('➜ Creando membresías de prueba...');
  const hoy = new Date();
  const finMes = new Date();
  finMes.setMonth(finMes.getMonth() + 1);

  // Carlos tiene membresía ACTIVA
  let membresiaActiva = await prisma.membresia.findFirst({
    where: { usuario_id: carlosUser.id, plan_id: planMensual.id },
  });

  if (!membresiaActiva) {
    membresiaActiva = await prisma.membresia.create({
      data: {
        usuario_id: carlosUser.id,
        plan_id: planMensual.id,
        fecha_inicio: hoy,
        fecha_fin: finMes,
        estado: 'ACTIVO',
        renovacion_automatica: true,
      },
    });
  }

  // Ana tiene membresía PENDIENTE_PAGO (para probar POST /pagos/simular)
  let membresiaPendiente = await prisma.membresia.findFirst({
    where: { usuario_id: anaUser.id, plan_id: planTrimestral.id },
  });

  if (!membresiaPendiente) {
    membresiaPendiente = await prisma.membresia.create({
      data: {
        usuario_id: anaUser.id,
        plan_id: planTrimestral.id,
        fecha_inicio: hoy,
        fecha_fin: finMes,
        estado: 'PENDIENTE_PAGO',
        renovacion_automatica: false,
      },
    });
  }

  // Martín (mora) tiene membresía VENCIDO: cuota vencida hace un mes (RN-03)
  const inicioVencida = new Date();
  inicioVencida.setMonth(inicioVencida.getMonth() - 2);
  const finVencida = new Date();
  finVencida.setMonth(finVencida.getMonth() - 1);

  let membresiaVencida = await prisma.membresia.findFirst({
    where: { usuario_id: moraUser.id, plan_id: planMensual.id },
  });

  if (!membresiaVencida) {
    membresiaVencida = await prisma.membresia.create({
      data: {
        usuario_id: moraUser.id,
        plan_id: planMensual.id,
        fecha_inicio: inicioVencida,
        fecha_fin: finVencida,
        estado: 'VENCIDO',
        renovacion_automatica: false,
      },
    });
  } else if (membresiaVencida.estado !== 'VENCIDO') {
    membresiaVencida = await prisma.membresia.update({
      where: { id: membresiaVencida.id },
      data: { estado: 'VENCIDO', fecha_inicio: inicioVencida, fecha_fin: finVencida },
    });
  }

  // ==========================================
  // 12. RESERVAS DE CANCHA
  // ==========================================
  console.log('➜ Creando reserva de cancha...');
  const fechaTurno = new Date();
  fechaTurno.setDate(fechaTurno.getDate() + 2);
  fechaTurno.setHours(0, 0, 0, 0);

  let reservaCancha = await prisma.reserva_cancha.findFirst({
    where: {
      cancha_id: canchaPaddle.id,
      fecha: fechaTurno,
      hora_inicio: 18,
    },
  });

  if (!reservaCancha) {
    reservaCancha = await prisma.reserva_cancha.create({
      data: {
        cancha_id: canchaPaddle.id,
        usuario_id: carlosUser.id,
        fecha: fechaTurno,
        hora_inicio: 18,
        estado: 'PENDIENTE_PAGO',
        precio_base: 8000.0,
        monto_total: 8000.0,
      },
    });
  }

  // ==========================================
  // 13. PAGO Y COMPROBANTE DE EJEMPLO
  // ==========================================
  console.log('➜ Creando pago y comprobante histórico...');
  let pagoEjemplo = await prisma.pago.findFirst({
    where: { membresia_id: membresiaActiva.id },
  });

  if (!pagoEjemplo) {
    pagoEjemplo = await prisma.pago.create({
      data: {
        membresia_id: membresiaActiva.id,
        monto: 15000.0,
        estado: 'APROBADO',
        token_pasarela: 'tok_mock_seed_inaugural',
        pagado_at: new Date(),
        comprobante: {
          create: {
            archivo_url: 'https://fitzone.com/comprobantes/recibo-seed-1.pdf',
          },
        },
      },
    });
  }

  // ==========================================
  // 14. REGISTRO DE ACCESO
  // ==========================================
  console.log('➜ Creando registro de acceso a sede...');
  const accesoExistente = await prisma.acceso.findFirst({
    where: { usuario_id: carlosUser.id, sede_id: sedeCentro.id },
  });

  if (!accesoExistente) {
    await prisma.acceso.create({
      data: {
        usuario_id: carlosUser.id,
        sede_id: sedeCentro.id,
        ingreso_at: new Date(),
      },
    });
  }

  console.log('\n======================================================');
  console.log('✅ Seed completado con éxito.');
  console.log('======================================================');
  console.log('📋 USUARIOS DE PRUEBA:');
  console.log('   - Gerente central:        admin@fitzone.com              | pass: Admin123!');
  console.log('   - Recepcionista (Centro): recepcion.centro@fitzone.com   | pass: Recepcion123!');
  console.log('   - Socio activo:           carlos.cliente@fitzone.com     | pass: Cliente123!');
  console.log('   - Cliente externo:        externo@fitzone.com            | pass: Externo123!');
  console.log('   - Socio en mora (RN-03):  mora@fitzone.com               | pass: Mora123!');
  console.log('   - Socio pago pendiente:   ana@fitzone.com                | pass: MiClaveSegura1');
  console.log('   - Instructor:             laura.instructor@fitzone.com   | pass: Instructor123!');
  console.log(`   - Total sedes cargadas:   ${todasLasSedes.length}`);
  console.log('\n🎯 DATOS CLAVE PARA TESTING DE ENDPOINTS:');
  console.log(`   - Login:             POST /auth/login { "email": "...", "password": "..." }`);
  console.log(`   - Sedes:             GET /sedes | Sede ID Centro: ${sedeCentro.id}, Costanera: ${sedeCostanera.id}`);
  console.log(`   - Planes:            GET /planes | Plan Mensual ID: ${planMensual.id}, Trimestral ID: ${planTrimestral.id}`);
  console.log(`   - Canchas:           GET /canchas | Paddle ID: ${canchaPaddle.id}, Mantenimiento ID: ${canchaMantenimiento.id}`);
  console.log(`   - Reservar Cancha:   POST /canchas/reserva { "cancha_id": ${canchaPaddle.id}, "usuario_id": ${carlosUser.id}, "fecha": "2026-11-05", "hora_inicio": 19 }`);
  console.log(`   - Clases:            GET /clases | Clase con cupo ID: ${claseConCupo.id}, Clase llena ID: ${claseLlena.id}`);
  console.log(`   - Reservar Clase:    POST /clases/reserva { "clase_id": ${claseConCupo.id}, "usuario_id": ${carlosUser.id} } (Confirma)`);
  console.log(`   - Lista de Espera:   POST /clases/reserva { "clase_id": ${claseLlena.id}, "usuario_id": ${anaUser.id} } (Espera)`);
  console.log(`   - Simular Pago Mem:  POST /pagos/simular { "origen_tipo": "membresia", "origen_id": ${membresiaPendiente.id}, "monto": 40000 }`);
  console.log(`   - Simular Pago Can:  POST /pagos/simular { "origen_tipo": "cancha", "origen_id": ${reservaCancha.id}, "monto": 8000 }`);
  console.log(`   - Listar Pagos:      GET /pagos`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
