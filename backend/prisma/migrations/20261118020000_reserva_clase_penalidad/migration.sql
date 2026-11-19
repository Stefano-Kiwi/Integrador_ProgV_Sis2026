-- RF-07: registra si la cancelación de una reserva de clase ocurrió con menos de 2 h de anticipación.
ALTER TABLE "reserva_clase" ADD COLUMN "con_penalidad" BOOLEAN NOT NULL DEFAULT false;
