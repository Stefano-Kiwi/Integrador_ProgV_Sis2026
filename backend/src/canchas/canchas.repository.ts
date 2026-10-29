import { Injectable } from '@nestjs/common';
import type { cancha, reserva_cancha } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCanchaDto } from './dto/create-cancha.dto.js';

export const CANCHA_INCLUDE = {
  tipo_cancha: true,
  sede: true,
} as const;

@Injectable()
export class CanchasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cancha.findMany({
      include: CANCHA_INCLUDE,
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.cancha.findUnique({
      where: { id },
      include: CANCHA_INCLUDE,
    });
  }

  create(dto: CreateCanchaDto): Promise<cancha> {
    return this.prisma.cancha.create({
      data: {
        tipo_cancha_id: dto.tipo_cancha_id,
        sede_id: dto.sede_id,
        nombre: dto.nombre,
        costo_hora: dto.costo_hora,
      },
      include: CANCHA_INCLUDE,
    });
  }

  findReservaByTurno(canchaId: number, fecha: Date, horaInicio: number): Promise<reserva_cancha | null> {
    return this.prisma.reserva_cancha.findFirst({
      where: {
        cancha_id: canchaId,
        fecha,
        hora_inicio: horaInicio,
        estado: { not: 'CANCELADA' },
      },
    });
  }

  createReserva(data: {
    cancha_id: number;
    usuario_id: number;
    fecha: Date;
    hora_inicio: number;
    precio_base: number;
    descuento?: number;
    recargo?: number;
    monto_total: number;
  }): Promise<reserva_cancha> {
    return this.prisma.reserva_cancha.create({
      data: {
        cancha_id: data.cancha_id,
        usuario_id: data.usuario_id,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        precio_base: data.precio_base,
        descuento: data.descuento ?? 0,
        recargo: data.recargo ?? 0,
        monto_total: data.monto_total,
        estado: 'PENDIENTE_PAGO',
      },
    });
  }
}
