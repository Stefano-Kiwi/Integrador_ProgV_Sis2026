import { Injectable } from '@nestjs/common';
import type { cancha, reserva_cancha } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCanchaDto } from './dto/create-cancha.dto.js';

export const CANCHA_INCLUDE = {
  tipo_cancha: true,
  sede: true,
} as const;

export const RESERVAS_CANCHA_SELECT = {
  id: true,
  fecha: true,
  hora_inicio: true,
  estado: true,
  monto_total: true,
  usuario: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      dni: true,
    },
  },
  cancha: {
    select: {
      id: true,
      nombre: true,
      tipo_cancha: true,
      sede: true,
    },
  },
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

  findAllReservas() {
    return this.prisma.reserva_cancha.findMany({
      select: RESERVAS_CANCHA_SELECT,
      orderBy: { id: 'desc' },
    });
  }

  findReservasByUsuario(usuarioId: number) {
    return this.prisma.reserva_cancha.findMany({
      where: { usuario_id: usuarioId },
      select: RESERVAS_CANCHA_SELECT,
      orderBy: { id: 'desc' },
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

  /**
   * Solo para validación amistosa (mensaje claro antes de intentar el insert).
   * La garantía de no sobreventa (RN-02) es el índice único parcial ux_reserva_cancha_slot.
   */
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

  findReservasActivasByFecha(canchaId: number, fecha: Date): Promise<reserva_cancha[]> {
    return this.prisma.reserva_cancha.findMany({
      where: { cancha_id: canchaId, fecha, estado: { not: 'CANCELADA' } },
    });
  }

  findReservaById(id: number): Promise<reserva_cancha | null> {
    return this.prisma.reserva_cancha.findUnique({ where: { id } });
  }

  /** RN-03: es socio solo quien tiene una membresía ACTIVO (VENCIDO/SUSPENDIDO/PENDIENTE_PAGO no). */
  async usuarioEsSocioActivo(usuarioId: number): Promise<boolean> {
    const cantidad = await this.prisma.membresia.count({
      where: { usuario_id: usuarioId, estado: 'ACTIVO' },
    });
    return cantidad > 0;
  }

  /**
   * Crea la reserva dentro de una transacción. Si el turno ya está tomado, el índice único parcial
   * ux_reserva_cancha_slot hace fallar el INSERT con P2002 (el llamador lo traduce a 409).
   */
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
    return this.prisma.$transaction((tx) =>
      tx.reserva_cancha.create({
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
      }),
    );
  }

  cancelarReserva(id: number, penalidad: number): Promise<reserva_cancha> {
    return this.prisma.reserva_cancha.update({
      where: { id },
      data: { estado: 'CANCELADA', cancelada_at: new Date(), penalidad },
    });
  }

  /** Solo modifica la cancha: las reservas existentes (confirmadas o no) no se tocan (RF-12). */
  updateEstado(id: number, estado: 'HABILITADA' | 'EN_MANTENIMIENTO') {
    return this.prisma.cancha.update({
      where: { id },
      data: { estado },
      include: CANCHA_INCLUDE,
    });
  }
}
