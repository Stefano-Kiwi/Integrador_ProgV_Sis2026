-- CreateEnum
CREATE TYPE "estado_cancha" AS ENUM ('HABILITADA', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "estado_lista_espera" AS ENUM ('EN_ESPERA', 'PROMOVIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "estado_membresia" AS ENUM ('ACTIVA', 'VENCIDA', 'SUSPENDIDA');

-- CreateEnum
CREATE TYPE "estado_pago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "estado_reserva_cancha" AS ENUM ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "estado_reserva_clase" AS ENUM ('CONFIRMADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "tipo_usuario" AS ENUM ('SOCIO', 'CLIENTE_EXTERNO');

-- CreateTable
CREATE TABLE "acceso" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "sede_id" INTEGER NOT NULL,
    "ingreso_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "egreso_at" TIMESTAMPTZ(6),

    CONSTRAINT "acceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancha" (
    "id" SERIAL NOT NULL,
    "tipo_cancha_id" INTEGER NOT NULL,
    "sede_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "costo_hora" DECIMAL(10,2) NOT NULL,
    "estado" "estado_cancha" NOT NULL DEFAULT 'HABILITADA',

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clase" (
    "id" SERIAL NOT NULL,
    "tipo_clase_id" INTEGER NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "sede_id" INTEGER NOT NULL,
    "capacidad_max" SMALLINT NOT NULL,
    "inicio_at" TIMESTAMPTZ(6) NOT NULL,
    "fin_at" TIMESTAMPTZ(6) NOT NULL,
    "cupo_disponible" SMALLINT NOT NULL,

    CONSTRAINT "clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_externo" (
    "usuario_id" INTEGER NOT NULL,
    "tipo" "tipo_usuario" NOT NULL DEFAULT 'CLIENTE_EXTERNO',

    CONSTRAINT "cliente_externo_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "comprobante" (
    "id" SERIAL NOT NULL,
    "pago_id" INTEGER NOT NULL,
    "emitido_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivo_url" TEXT,

    CONSTRAINT "comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credencial_qr" (
    "socio_id" INTEGER NOT NULL,
    "secreto" VARCHAR(255) NOT NULL,
    "creada_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rotada_at" TIMESTAMPTZ(6),

    CONSTRAINT "credencial_qr_pkey" PRIMARY KEY ("socio_id")
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera_clase" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "clase_id" INTEGER NOT NULL,
    "estado" "estado_lista_espera" NOT NULL DEFAULT 'EN_ESPERA',
    "creada_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lista_espera_clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membresia" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" "estado_membresia" NOT NULL DEFAULT 'ACTIVA',
    "renovacion_automatica" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "membresia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "membresia_id" INTEGER,
    "reserva_cancha_id" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado" "estado_pago" NOT NULL DEFAULT 'PENDIENTE',
    "token" VARCHAR(255),
    "creado_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_membresia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "duracion_meses" SMALLINT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "plan_membresia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva_cancha" (
    "id" SERIAL NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" SMALLINT NOT NULL,
    "estado" "estado_reserva_cancha" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "precio_base" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "recargo_hora_pico" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "monto_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reserva_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva_clase" (
    "id" SERIAL NOT NULL,
    "clase_id" INTEGER NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "estado" "estado_reserva_clase" NOT NULL DEFAULT 'CONFIRMADA',
    "reservada_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelada_at" TIMESTAMPTZ(6),

    CONSTRAINT "reserva_clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sede" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "aforo_maximo" INTEGER NOT NULL,
    "ubicacion_simple" VARCHAR(150) NOT NULL,
    "ubicacion_exacta" VARCHAR(255) NOT NULL,
    "aforo_actual" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socio" (
    "usuario_id" INTEGER NOT NULL,
    "tipo" "tipo_usuario" NOT NULL DEFAULT 'SOCIO',

    CONSTRAINT "socio_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "tipo_cancha" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipo_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_clase" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipo_clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "tipo" "tipo_usuario" NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(30),
    "foto_url" TEXT,
    "password_hash" VARCHAR(255) NOT NULL,
    "fecha_alta" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_acceso_sede" ON "acceso"("sede_id");

-- CreateIndex
CREATE UNIQUE INDEX "cancha_sede_id_nombre_key" ON "cancha"("sede_id", "nombre");

-- CreateIndex
CREATE INDEX "ix_clase_instructor" ON "clase"("instructor_id");

-- CreateIndex
CREATE INDEX "ix_clase_sede" ON "clase"("sede_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_externo_usuario_id_tipo_key" ON "cliente_externo"("usuario_id", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "comprobante_pago_id_key" ON "comprobante"("pago_id");

-- CreateIndex
CREATE INDEX "ix_lista_espera_clase" ON "lista_espera_clase"("clase_id", "creada_at");

-- CreateIndex
CREATE INDEX "ix_membresia_socio" ON "membresia"("socio_id");

-- CreateIndex
CREATE INDEX "ix_pago_membresia" ON "pago"("membresia_id");

-- CreateIndex
CREATE INDEX "ix_pago_reserva_cancha" ON "pago"("reserva_cancha_id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_membresia_nombre_key" ON "plan_membresia"("nombre");

-- CreateIndex
CREATE INDEX "ix_reserva_cancha_usuario" ON "reserva_cancha"("usuario_id");

-- CreateIndex
CREATE INDEX "ix_reserva_clase_clase" ON "reserva_clase"("clase_id");

-- CreateIndex
CREATE UNIQUE INDEX "sede_nombre_key" ON "sede"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "socio_usuario_id_tipo_key" ON "socio"("usuario_id", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_cancha_nombre_key" ON "tipo_cancha"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_clase_nombre_key" ON "tipo_clase"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_dni_key" ON "usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_id_tipo_key" ON "usuario"("id", "tipo");

-- AddForeignKey
ALTER TABLE "acceso" ADD CONSTRAINT "acceso_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acceso" ADD CONSTRAINT "acceso_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socio"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "cancha_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "cancha_tipo_cancha_id_fkey" FOREIGN KEY ("tipo_cancha_id") REFERENCES "tipo_cancha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clase" ADD CONSTRAINT "clase_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clase" ADD CONSTRAINT "clase_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clase" ADD CONSTRAINT "clase_tipo_clase_id_fkey" FOREIGN KEY ("tipo_clase_id") REFERENCES "tipo_clase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cliente_externo" ADD CONSTRAINT "cliente_externo_usuario_id_tipo_fkey" FOREIGN KEY ("usuario_id", "tipo") REFERENCES "usuario"("id", "tipo") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comprobante" ADD CONSTRAINT "comprobante_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credencial_qr" ADD CONSTRAINT "credencial_qr_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socio"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lista_espera_clase" ADD CONSTRAINT "lista_espera_clase_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lista_espera_clase" ADD CONSTRAINT "lista_espera_clase_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socio"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "membresia" ADD CONSTRAINT "membresia_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan_membresia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "membresia" ADD CONSTRAINT "membresia_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socio"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_membresia_id_fkey" FOREIGN KEY ("membresia_id") REFERENCES "membresia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_reserva_cancha_id_fkey" FOREIGN KEY ("reserva_cancha_id") REFERENCES "reserva_cancha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva_cancha" ADD CONSTRAINT "reserva_cancha_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva_cancha" ADD CONSTRAINT "reserva_cancha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva_clase" ADD CONSTRAINT "reserva_clase_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva_clase" ADD CONSTRAINT "reserva_clase_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socio"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_usuario_id_tipo_fkey" FOREIGN KEY ("usuario_id", "tipo") REFERENCES "usuario"("id", "tipo") ON DELETE CASCADE ON UPDATE NO ACTION;

