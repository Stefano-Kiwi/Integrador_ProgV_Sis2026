-- Índice compuesto para la consulta de disponibilidad de canchas (RNF-03).
-- Declarado también en schema.prisma (@@index) para mantener el esquema sincronizado.
CREATE INDEX "ix_reserva_cancha_disponibilidad"
    ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio");

-- Índices únicos PARCIALES: Prisma no puede expresarlos en schema.prisma,
-- por eso viven solo en esta migración (SQL crudo). Provienen de database/init.sql.

-- RN-02 (no sobreventa): un único turno activo por cancha/fecha/hora.
-- Una reserva CANCELADA libera el horario.
CREATE UNIQUE INDEX "ux_reserva_cancha_slot"
    ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio")
    WHERE "estado" <> 'CANCELADA';

-- RN-01 (no simultaneidad de sedes): un usuario solo puede tener un acceso abierto.
CREATE UNIQUE INDEX "ux_acceso_activo_por_usuario"
    ON "acceso"("usuario_id")
    WHERE "egreso_at" IS NULL;

-- Un usuario no puede tener dos reservas CONFIRMADAS de la misma clase.
CREATE UNIQUE INDEX "ux_reserva_clase_activa"
    ON "reserva_clase"("usuario_id", "clase_id")
    WHERE "estado" = 'CONFIRMADA';

-- Un usuario no puede estar dos veces EN_ESPERA de la misma clase.
CREATE UNIQUE INDEX "ux_lista_espera_activa"
    ON "lista_espera_clase"("usuario_id", "clase_id")
    WHERE "estado" = 'EN_ESPERA';
