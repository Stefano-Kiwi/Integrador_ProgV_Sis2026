-- =====================================================================
-- FitZone Sports - Esquema de base de datos (PostgreSQL)
-- Generado a partir del DER (drawio / mermaid) del integrador
-- Este script es IDEMPOTENTE respecto a la creación inicial: se ejecuta
-- una sola vez, automáticamente, la primera vez que se crea el
-- contenedor de Docker (ver docker-entrypoint-initdb.d).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. TIPOS ENUMERADOS
-- (Cada uno representa los valores de "estado" definidos en el DER)
-- ---------------------------------------------------------------------
CREATE TYPE estado_membresia       AS ENUM ('PENDIENTE_PAGO', 'ACTIVO', 'VENCIDO', 'SUSPENDIDO');
CREATE TYPE estado_reserva_clase   AS ENUM ('CONFIRMADA', 'CANCELADA');
CREATE TYPE estado_lista_espera    AS ENUM ('EN_ESPERA', 'NOTIFICADO', 'CONVERTIDO', 'CANCELADO');
CREATE TYPE estado_cancha          AS ENUM ('HABILITADA', 'EN_MANTENIMIENTO');
CREATE TYPE estado_reserva_cancha  AS ENUM ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA');
CREATE TYPE estado_pago            AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- ---------------------------------------------------------------------
-- 1. ROL
-- Tabla de catálogo: tipos de usuario (Cliente, Instructor/Profesor,
-- Gerente/Administrador), según la página 1 del diagrama.
-- NOTA: en el DER esta tabla usa nombres de columna distintos al resto
-- (id_rol / clase_rol en lugar de id / nombre). Se respeta tal cual
-- está dibujada; si preferís unificar el estilo, es un ALTER fácil.
-- ---------------------------------------------------------------------
CREATE TABLE rol (
    id_rol      SERIAL PRIMARY KEY,
    clase_rol   VARCHAR(50) NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------
-- 2. SEDE
-- ---------------------------------------------------------------------
CREATE TABLE sede (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(150) NOT NULL UNIQUE,
    direccion     VARCHAR(200) NOT NULL,
    localidad     VARCHAR(100) NOT NULL,
    aforo_maximo  INTEGER NOT NULL CHECK (aforo_maximo > 0), -- RF-05
    creada_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 3. USUARIO
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id             SERIAL PRIMARY KEY,
    dni            VARCHAR(20)  NOT NULL UNIQUE,  -- RF-01
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    telefono       VARCHAR(30),
    foto_url       TEXT,
    password_hash  VARCHAR(255) NOT NULL,
    id_rol         INTEGER NOT NULL REFERENCES rol(id_rol),
    sede_base_id   INTEGER REFERENCES sede(id),   -- nullable: usuario puede no tener sede fija
    creado_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_usuario_id_rol       ON usuario(id_rol);
CREATE INDEX ix_usuario_sede_base_id ON usuario(sede_base_id);

-- ---------------------------------------------------------------------
-- 4. CREDENCIAL_QR (1:1 con USUARIO)
-- ---------------------------------------------------------------------
CREATE TABLE credencial_qr (
    usuario_id  INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    secreto     VARCHAR(255) NOT NULL,  -- QR dinámico, RF-04
    creada_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    rotada_at   TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- 5. PLAN_MEMBRESIA
-- ---------------------------------------------------------------------
CREATE TABLE plan_membresia (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL UNIQUE, -- Mensual, Trimestral, Anual
    duracion_meses   SMALLINT NOT NULL CHECK (duracion_meses > 0),
    precio           NUMERIC(10,2) NOT NULL CHECK (precio >= 0)
);

-- ---------------------------------------------------------------------
-- 6. MEMBRESIA
-- ---------------------------------------------------------------------
CREATE TABLE membresia (
    id                      SERIAL PRIMARY KEY,
    usuario_id              INTEGER NOT NULL REFERENCES usuario(id),
    plan_id                 INTEGER NOT NULL REFERENCES plan_membresia(id),
    fecha_inicio            DATE NOT NULL,
    fecha_fin               DATE NOT NULL,
    estado                  estado_membresia NOT NULL DEFAULT 'PENDIENTE_PAGO',
    renovacion_automatica   BOOLEAN NOT NULL DEFAULT false,
    creada_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (fecha_fin >= fecha_inicio)
);
CREATE INDEX ix_membresia_usuario_id ON membresia(usuario_id);
CREATE INDEX ix_membresia_plan_id    ON membresia(plan_id);

-- ---------------------------------------------------------------------
-- 7. ACCESO
-- Regla del DER: "el usuario solo puede tener 1 acceso activo al mismo
-- tiempo" -> se traduce en un índice único parcial (solo aplica a los
-- accesos que siguen abiertos, egreso_at IS NULL).
-- ---------------------------------------------------------------------
CREATE TABLE acceso (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER NOT NULL REFERENCES usuario(id),
    sede_id     INTEGER NOT NULL REFERENCES sede(id),
    ingreso_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    egreso_at   TIMESTAMPTZ,  -- NULL = usuario todavía está adentro
    CHECK (egreso_at IS NULL OR egreso_at >= ingreso_at)
);
CREATE INDEX ix_acceso_sede_id ON acceso(sede_id);
CREATE UNIQUE INDEX ux_acceso_activo_por_usuario
    ON acceso(usuario_id) WHERE egreso_at IS NULL;

-- ---------------------------------------------------------------------
-- 8. TIPO_CLASE
-- ---------------------------------------------------------------------
CREATE TABLE tipo_clase (
    id      SERIAL PRIMARY KEY,
    nombre  VARCHAR(100) NOT NULL UNIQUE  -- Spinning, Yoga, etc.
);

-- ---------------------------------------------------------------------
-- 9. INSTRUCTOR
-- OJO - INCONSISTENCIA DETECTADA Y CORREGIDA:
-- en el XML esta tabla tenía una fila incompleta (tipo "ID", columna
-- "Usuario", sin marca de clave), que claramente representa la FK a
-- usuario que después usa la relación INSTRUCTOR -> CLASE ("dicta") y
-- la restricción "instructores solo acepta a usuarios del rol
-- instructor/profesor". Se completó como usuario_id INTEGER, FK y
-- UNIQUE (relación 1:1 con usuario). La restricción de que ese usuario
-- tenga rol = 'Instructor' no se puede expresar con un FK común en
-- Postgres (se valida contra una fila filtrada por rol); queda como
-- validación a nivel de aplicación (servicio de NestJS) al crear un
-- instructor, salvo que después quieran agregar un trigger.
-- ---------------------------------------------------------------------
CREATE TABLE instructor (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER NOT NULL UNIQUE REFERENCES usuario(id)
);

-- ---------------------------------------------------------------------
-- 10. CLASE
-- ---------------------------------------------------------------------
CREATE TABLE clase (
    id                 SERIAL PRIMARY KEY,
    sede_id            INTEGER NOT NULL REFERENCES sede(id),
    tipo_clase_id      INTEGER NOT NULL REFERENCES tipo_clase(id),
    instructor_id      INTEGER NOT NULL REFERENCES instructor(id),
    inicio_at          TIMESTAMPTZ NOT NULL,
    fin_at             TIMESTAMPTZ NOT NULL,
    capacidad_maxima   SMALLINT NOT NULL CHECK (capacidad_maxima > 0),
    cupo_disponible    SMALLINT NOT NULL, -- RF-07: se decrementa con cada reserva
    CHECK (fin_at > inicio_at),
    CHECK (cupo_disponible BETWEEN 0 AND capacidad_maxima)
);
CREATE INDEX ix_clase_sede_id       ON clase(sede_id);
CREATE INDEX ix_clase_tipo_clase_id ON clase(tipo_clase_id);
CREATE INDEX ix_clase_instructor_id ON clase(instructor_id);

-- ---------------------------------------------------------------------
-- 11. RESERVA_CLASE
-- Se agrega UNIQUE(usuario_id, clase_id) parcial (solo reservas no
-- canceladas) como resguardo para que un mismo usuario no reserve dos
-- veces la misma clase. No estaba explícito en el DER: se puede quitar
-- si el equipo prefiere permitirlo.
-- ---------------------------------------------------------------------
CREATE TABLE reserva_clase (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER NOT NULL REFERENCES usuario(id),
    clase_id       INTEGER NOT NULL REFERENCES clase(id),
    estado         estado_reserva_clase NOT NULL DEFAULT 'CONFIRMADA',
    reservada_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    cancelada_at   TIMESTAMPTZ
);
CREATE INDEX ix_reserva_clase_clase_id ON reserva_clase(clase_id);
CREATE UNIQUE INDEX ux_reserva_clase_activa
    ON reserva_clase(usuario_id, clase_id) WHERE estado = 'CONFIRMADA';

-- ---------------------------------------------------------------------
-- 12. LISTA_ESPERA_CLASE
-- ---------------------------------------------------------------------
CREATE TABLE lista_espera_clase (
    id              SERIAL PRIMARY KEY,
    usuario_id      INTEGER NOT NULL REFERENCES usuario(id),
    clase_id        INTEGER NOT NULL REFERENCES clase(id),
    estado          estado_lista_espera NOT NULL DEFAULT 'EN_ESPERA',
    creada_at       TIMESTAMPTZ NOT NULL DEFAULT now(), -- define orden FIFO
    notificada_at   TIMESTAMPTZ
);
CREATE INDEX ix_lista_espera_clase_id ON lista_espera_clase(clase_id);
CREATE UNIQUE INDEX ux_lista_espera_activa
    ON lista_espera_clase(usuario_id, clase_id) WHERE estado = 'EN_ESPERA';

-- ---------------------------------------------------------------------
-- 13. TIPO_CANCHA
-- ---------------------------------------------------------------------
CREATE TABLE tipo_cancha (
    id      SERIAL PRIMARY KEY,
    nombre  VARCHAR(100) NOT NULL UNIQUE -- Paddle, Futbol 5
);

-- ---------------------------------------------------------------------
-- 14. CANCHA
-- ---------------------------------------------------------------------
CREATE TABLE cancha (
    id               SERIAL PRIMARY KEY,
    sede_id          INTEGER NOT NULL REFERENCES sede(id),
    tipo_cancha_id   INTEGER NOT NULL REFERENCES tipo_cancha(id),
    nombre           VARCHAR(100) NOT NULL, -- UK compuesta con sede_id
    costo_hora       NUMERIC(10,2) NOT NULL CHECK (costo_hora >= 0),
    estado           estado_cancha NOT NULL DEFAULT 'HABILITADA',
    UNIQUE (sede_id, nombre)
);
CREATE INDEX ix_cancha_tipo_cancha_id ON cancha(tipo_cancha_id);

-- ---------------------------------------------------------------------
-- 15. RESERVA_CANCHA
-- Regla del DER: "una cancha solo puede tener una clase al mismo
-- tiempo" NO se pudo aplicar tal cual: el DER no tiene ninguna relación
-- CANCHA<->CLASE (CLASE no tiene columna cancha_id). Es una
-- inconsistencia entre la nota de restricción y el modelo dibujado;
-- avisale al equipo. Lo que SÍ está bien modelado y se implementa acá
-- es la concurrencia de RESERVA_CANCHA, vía índice único parcial sobre
-- (cancha_id, fecha, hora_inicio) - coincide con la estrategia de
-- ADR-002 (UNIQUE + 409 en vez de locking en la aplicación).
-- ---------------------------------------------------------------------
CREATE TABLE reserva_cancha (
    id              SERIAL PRIMARY KEY,
    cancha_id       INTEGER NOT NULL REFERENCES cancha(id),
    usuario_id      INTEGER NOT NULL REFERENCES usuario(id),
    fecha           DATE NOT NULL,
    hora_inicio     SMALLINT NOT NULL CHECK (hora_inicio BETWEEN 0 AND 23),
    estado          estado_reserva_cancha NOT NULL DEFAULT 'PENDIENTE_PAGO',
    precio_base     NUMERIC(10,2) NOT NULL CHECK (precio_base >= 0),
    descuento       NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),  -- RF-11 socio 15%
    recargo         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (recargo >= 0),    -- RF-11 hora pico
    monto_total     NUMERIC(10,2) NOT NULL CHECK (monto_total >= 0),
    creada_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    cancelada_at    TIMESTAMPTZ
);
CREATE INDEX ix_reserva_cancha_usuario_id ON reserva_cancha(usuario_id);
CREATE UNIQUE INDEX ux_reserva_cancha_slot
    ON reserva_cancha(cancha_id, fecha, hora_inicio) WHERE estado <> 'CANCELADA';

-- ---------------------------------------------------------------------
-- 16. PAGO
-- Regla del DER: "XOR con reserva_cancha_id" -> un pago corresponde a
-- UNA membresía O a UNA reserva de cancha, nunca ambas ni ninguna.
-- ---------------------------------------------------------------------
CREATE TABLE pago (
    id                  SERIAL PRIMARY KEY,
    membresia_id        INTEGER REFERENCES membresia(id),
    reserva_cancha_id   INTEGER REFERENCES reserva_cancha(id),
    monto               NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
    estado              estado_pago NOT NULL DEFAULT 'PENDIENTE',
    token_pasarela      VARCHAR(255),  -- RNF-02: nunca datos de tarjeta
    creado_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    pagado_at           TIMESTAMPTZ,
    CONSTRAINT ck_pago_xor_origen CHECK (
        (membresia_id IS NOT NULL AND reserva_cancha_id IS NULL) OR
        (membresia_id IS NULL AND reserva_cancha_id IS NOT NULL)
    )
);
CREATE INDEX ix_pago_membresia_id      ON pago(membresia_id);
CREATE INDEX ix_pago_reserva_cancha_id ON pago(reserva_cancha_id);

-- ---------------------------------------------------------------------
-- 17. COMPROBANTE (1:1 con PAGO)
-- ---------------------------------------------------------------------
CREATE TABLE comprobante (
    id            SERIAL PRIMARY KEY,
    pago_id       INTEGER NOT NULL UNIQUE REFERENCES pago(id),
    emitido_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    archivo_url   TEXT NOT NULL
);

-- =====================================================================
-- SEED: datos de ejemplo mínimos para poder probar la conexión desde
-- DBeaver y desde NestJS (paso 3 y 6 de la guía).
-- =====================================================================
INSERT INTO rol (clase_rol) VALUES
    ('Cliente'), ('Instructor'), ('Gerente');

INSERT INTO plan_membresia (nombre, duracion_meses, precio) VALUES
    ('Mensual', 1, 15000.00),
    ('Trimestral', 3, 40000.00),
    ('Anual', 12, 140000.00);

INSERT INTO tipo_clase (nombre) VALUES
    ('Spinning'), ('Yoga'), ('Funcional');

INSERT INTO tipo_cancha (nombre) VALUES
    ('Paddle'), ('Futbol 5');

INSERT INTO sede (nombre, direccion, localidad, aforo_maximo) VALUES
    ('FitZone Concordia Centro', 'Av. Siempre Viva 123', 'Concordia', 80);
