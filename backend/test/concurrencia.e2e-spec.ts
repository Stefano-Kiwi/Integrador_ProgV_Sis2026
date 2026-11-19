import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

try {
  process.loadEnvFile();
} catch {
  // usa variables de entorno del sistema (p. ej. GitHub Actions)
}

/**
 * Tests de concurrencia reales contra PostgreSQL (RN-02 y RN-01).
 * Requieren PostgreSQL levantado con migraciones y seed aplicados:
 *   npm run db:migrate && npm run seed && npm run test:e2e
 */
describe('Concurrencia real contra PostgreSQL (RN-02 y RN-01)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tokenSocio: string;
  let tokenAdmin: string;
  let socioId: number;
  let canchaId: number;
  let sede1Id: number;
  let sede2Id: number;

  const fechaPrueba = '2027-06-15';
  const horaPrueba = 20;

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

    // Login socio activo y gerente/admin del seed
    const loginSocio = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'carlos.cliente@fitzone.com', password: 'Cliente123!' })
      .expect(200);
    tokenSocio = loginSocio.body.access_token;

    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'recepcion.centro@fitzone.com', password: 'Recepcion123!' })
      .expect(200);
    tokenAdmin = loginAdmin.body.access_token;

    const socio = await prisma.usuario.findUniqueOrThrow({
      where: { email: 'carlos.cliente@fitzone.com' },
    });
    socioId = socio.id;

    const cancha = await prisma.cancha.findFirstOrThrow({
      where: { estado: 'HABILITADA' },
    });
    canchaId = cancha.id;

    const sedes = await prisma.sede.findMany({ take: 2, orderBy: { id: 'asc' } });
    sede1Id = sedes[0].id;
    sede2Id = sedes[1].id;

    // Limpieza previa del slot y accesos abiertos del socio
    await prisma.reserva_cancha.deleteMany({
      where: { cancha_id: canchaId, fecha: new Date(fechaPrueba), hora_inicio: horaPrueba },
    });
    await prisma.acceso.updateMany({
      where: { usuario_id: socioId, egreso_at: null },
      data: { egreso_at: new Date() },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.reserva_cancha.deleteMany({
        where: { cancha_id: canchaId, fecha: new Date(fechaPrueba), hora_inicio: horaPrueba },
      });
      await prisma.acceso.updateMany({
        where: { usuario_id: socioId, egreso_at: null },
        data: { egreso_at: new Date() },
      });
    }
    if (app) {
      await app.close();
    }
  });

  it('RN-02: ante 12 reservas simultáneas de la misma cancha/fecha/hora, exactamente 1 devuelve 201 y 11 devuelven 409', async () => {
    const N = 12;
    const payload = {
      cancha_id: canchaId,
      usuario_id: socioId,
      fecha: fechaPrueba,
      hora_inicio: horaPrueba,
    };

    const respuestas = await Promise.all(
      Array.from({ length: N }, () =>
        request(app.getHttpServer())
          .post('/canchas/reserva')
          .set('Authorization', `Bearer ${tokenSocio}`)
          .send(payload),
      ),
    );

    const codigos = respuestas.map((r) => r.status);
    const creadas = codigos.filter((c) => c === 201);
    const conflictos = codigos.filter((c) => c === 409);

    expect(creadas).toHaveLength(1);
    expect(conflictos).toHaveLength(N - 1);
  });

  it('RN-01: ante 2 ingresos simultáneos a sedes distintas, exactamente 1 se autoriza y el otro devuelve 409', async () => {
    const qrRes = await request(app.getHttpServer())
      .get('/acceso/qr')
      .set('Authorization', `Bearer ${tokenSocio}`)
      .expect(200);

    const qr = qrRes.body.qr as string;

    const respuestas = await Promise.all([
      request(app.getHttpServer())
        .post('/acceso/validar')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ qr, sedeId: sede1Id }),
      request(app.getHttpServer())
        .post('/acceso/validar')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ qr, sedeId: sede2Id }),
    ]);

    const codigos = respuestas.map((r) => r.status);
    expect(codigos.filter((c) => c === 201 || c === 200)).toHaveLength(1);
    expect(codigos.filter((c) => c === 409)).toHaveLength(1);

    // Cerrar acceso abierto
    await request(app.getHttpServer())
      .post('/acceso/egreso')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ userId: socioId })
      .expect(201);
  });
});
