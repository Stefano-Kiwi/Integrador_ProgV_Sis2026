-- RF-10: ciclo de vida de la reserva PENDIENTE_PAGO -> CONFIRMADA -> CUMPLIDA / CANCELADA.
ALTER TYPE "estado_reserva_cancha" ADD VALUE 'CUMPLIDA';

-- Penalidad retenida al cancelar una reserva ya pagada con poca antelación.
ALTER TABLE "reserva_cancha" ADD COLUMN "penalidad" DECIMAL(10,2) NOT NULL DEFAULT 0;
