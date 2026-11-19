import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

try {
  process.loadEnvFile();
} catch {
  // usa variables de entorno del sistema
}

/**
 * Tests de integración end-to-end (Supertest) de los 3 flujos principales:
 * 1) Login → reservar cancha → pagar → descargar comprobante PDF
 * 2) Reservar clase → enlistar 2do socio → cancelar 1ro → promoción FIFO (Observer)
 * 3) Generar QR → validar acceso → consultar aforo → registrar egreso
 */
describe('Flujos de integración (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tokenSocio1: string;
  let tokenSocio2: string;
  let tokenAdmin: string;
  let socio1Id: number;
  let socio2Id: number;
  let sedeId: number;
  let canchaId: number;

  const fechaReserva = '2027-07-20';
  const horaReserva = 19; // horario pico

  const limpiarReservaPrueba = async () => {
    const reservas = await prisma.reserva_cancha.findMany({
      where: { cancha_id: canchaId, fecha: new Date(fechaReserva), hora_inicio: horaReserva },
      select: { id: true },
    });
    const reservaIds = reservas.map((r) => r.id);
    if (reservaIds.length > 0) {
      const pagos = await prisma.pago.findMany({
        where: { reserva_cancha_id: { in: reservaIds } },
        select: { id: true },
      });
      const pagoIds = pagos.map((p) => p.id);
      if (pagoIds.length > 0) {
        await prisma.comprobante.deleteMany({ where: { pago_id: { in: pagoIds } } });
        await prisma.pago.deleteMany({ where: { id: { in: pagoIds } } });
      }
      await prisma.reserva_cancha.deleteMany({ where: { id: { in: reservaIds } } });
    }
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@fitzone.com', password: 'Admin123!' })
      .expect(200);
    tokenAdmin = loginAdmin.body.access_token;

    const login1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'carlos.cliente@fitzone.com', password: 'Cliente123!' })
      .expect(200);
    tokenSocio1 = login1.body.access_token;

    const login2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ana@fitzone.com', password: 'MiClaveSegura1' })
      .expect(200);
    tokenSocio2 = login2.body.access_token;

    const u1 = await prisma.usuario.findUniqueOrThrow({ where: { email: 'carlos.cliente@fitzone.com' } });
    const u2 = await prisma.usuario.findUniqueOrThrow({ where: { email: 'ana@fitzone.com' } });
    socio1Id = u1.id;
    socio2Id = u2.id;

    // Asegurar membresía ACTIVO para socio2 durante el test de clases
    const plan = await prisma.plan_membresia.findFirstOrThrow();
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 1);
    const mem2 = await prisma.membresia.findFirst({ where: { usuario_id: socio2Id } });
    if (mem2) {
      await prisma.membresia.update({ where: { id: mem2.id }, data: { estado: 'ACTIVO', fecha_fin: fin } });
    } else {
      await prisma.membresia.create({
        data: { usuario_id: socio2Id, plan_id: plan.id, fecha_inicio: new Date(), fecha_fin: fin, estado: 'ACTIVO' },
      });
    }

    const cancha = await prisma.cancha.findFirstOrThrow({ where: { estado: 'HABILITADA' } });
    canchaId = cancha.id;
    sedeId = cancha.sede_id;

    await limpiarReservaPrueba();
    await prisma.acceso.updateMany({
      where: { usuario_id: socio1Id, egreso_at: null },
      data: { egreso_at: new Date() },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await limpiarReservaPrueba();
      await prisma.acceso.updateMany({
        where: { usuario_id: socio1Id, egreso_at: null },
        data: { egreso_at: new Date() },
      });
    }
    if (app) {
      await app.close();
    }
  });

  it('Flujo 1: login → reservar cancha → pagar → descargar comprobante PDF', async () => {
    const resReserva = await request(app.getHttpServer())
      .post('/canchas/reserva')
      .set('Authorization', `Bearer ${tokenSocio1}`)
      .send({
        cancha_id: canchaId,
        usuario_id: socio1Id,
        fecha: fechaReserva,
        hora_inicio: horaReserva,
      })
      .expect(201);

    const reservaId = resReserva.body.reserva_id as number;
    const montoTotal = Number(resReserva.body.monto_total);
    expect(montoTotal).toBeGreaterThan(0);

    const resPago = await request(app.getHttpServer())
      .post('/pagos/simular')
      .set('Authorization', `Bearer ${tokenSocio1}`)
      .send({ origen_tipo: 'cancha', origen_id: reservaId, monto: montoTotal })
      .expect(201);

    const pagoId = resPago.body.pago_id as number;
    expect(resPago.body.estado).toBe('APROBADO');
    expect(resPago.body.token_pasarela).toMatch(/^tok_/);

    const resPdf = await request(app.getHttpServer())
      .get(`/pagos/${pagoId}/comprobante`)
      .set('Authorization', `Bearer ${tokenSocio1}`)
      .expect(200);

    expect(resPdf.headers['content-type']).toContain('application/pdf');
    expect(Buffer.from(resPdf.body).toString('utf-8').startsWith('%PDF-1.4')).toBe(true);
  });

  it('Flujo 2: reservar clase → 2do socio a lista de espera → cancelar 1ro → promoción FIFO (Observer)', async () => {
    const tipoClase = await prisma.tipo_clase.findFirstOrThrow();
    const instructor = await prisma.instructor.findFirstOrThrow();
    const inicio = new Date(Date.now() + 12 * 3_600_000); // dentro de 12 h (<= 48 h y >= 2 h)
    const fin = new Date(inicio.getTime() + 3_600_000);

    const clase = await prisma.clase.create({
      data: {
        sede_id: sedeId,
        tipo_clase_id: tipoClase.id,
        instructor_id: instructor.id,
        inicio_at: inicio,
        fin_at: fin,
        capacidad_maxima: 1,
        cupo_disponible: 1,
      },
    });

    try {
      // Socio 1 toma el único cupo
      const r1 = await request(app.getHttpServer())
        .post('/clases/reserva')
        .set('Authorization', `Bearer ${tokenSocio1}`)
        .send({ clase_id: clase.id, usuario_id: socio1Id })
        .expect(201);
      expect(r1.body.estado).toBe('CONFIRMADA');
      const reserva1Id = r1.body.reserva_id as number;

      // Socio 2 entra en lista de espera posición 1
      const r2 = await request(app.getHttpServer())
        .post('/clases/reserva')
        .set('Authorization', `Bearer ${tokenSocio2}`)
        .send({ clase_id: clase.id, usuario_id: socio2Id })
        .expect(201);
      expect(r2.body.estado).toBe('EN_ESPERA');
      expect(r2.body.posicion).toBe(1);

      // Socio 1 cancela (>= 2 h antes -> sin penalidad) y Observer promueve a Socio 2
      const cancel = await request(app.getHttpServer())
        .patch(`/clases/reserva/${reserva1Id}/cancelar`)
        .set('Authorization', `Bearer ${tokenSocio1}`)
        .expect(200);

      expect(cancel.body.estado).toBe('CANCELADA');
      expect(cancel.body.con_penalidad).toBe(false);
      expect(cancel.body.promovido_desde_lista_espera).toMatchObject({
        usuarioId: socio2Id,
        claseId: clase.id,
      });
    } finally {
      await prisma.lista_espera_clase.deleteMany({ where: { clase_id: clase.id } });
      await prisma.reserva_clase.deleteMany({ where: { clase_id: clase.id } });
      await prisma.clase.delete({ where: { id: clase.id } });
    }
  });

  it('Flujo 3: QR dinámico → validar acceso → aforo → egreso', async () => {
    const qrRes = await request(app.getHttpServer())
      .get('/acceso/qr')
      .set('Authorization', `Bearer ${tokenSocio1}`)
      .expect(200);
    expect(qrRes.body.validez_segundos).toBe(60);

    const valRes = await request(app.getHttpServer())
      .post('/acceso/validar')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ qr: qrRes.body.qr, sedeId })
      .expect(201);
    expect(valRes.body.autorizado).toBe(true);

    const aforoRes = await request(app.getHttpServer())
      .get(`/acceso/aforo/${sedeId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);
    expect(aforoRes.body.aforo_actual).toBeGreaterThanOrEqual(1);

    const egresoRes = await request(app.getHttpServer())
      .post('/acceso/egreso')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ userId: socio1Id })
      .expect(201);
    expect(egresoRes.body.egreso_at).toBeTruthy();
  });
});
