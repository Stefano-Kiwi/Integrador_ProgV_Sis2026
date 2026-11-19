import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { OrigenPagoTipo } from './dto/simular-pago.dto.js';

const PAGO_INCLUDE = {
  comprobante: true,
  reserva_cancha: {
    include: {
      cancha: {
        include: { sede: true, tipo_cancha: true },
      },
    },
  },
  membresia: {
    include: { plan_membresia: true },
  },
} as const;

@Injectable()
export class PagosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pago.findMany({
      include: PAGO_INCLUDE,
      orderBy: { creado_at: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: PAGO_INCLUDE,
    });
  }

  findReservaCancha(id: number) {
    return this.prisma.reserva_cancha.findUnique({
      where: { id },
      include: {
        cancha: {
          include: { sede: true, tipo_cancha: true },
        },
      },
    });
  }

  findMembresia(id: number) {
    return this.prisma.membresia.findUnique({
      where: { id },
      include: { plan_membresia: true },
    });
  }

  async procesarPago(data: {
    origen_tipo: OrigenPagoTipo;
    origen_id: number;
    monto: number;
    token_pasarela: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const isCancha = data.origen_tipo === 'cancha';

      const nuevoPago = await tx.pago.create({
        data: {
          monto: data.monto,
          estado: 'APROBADO',
          token_pasarela: data.token_pasarela,
          reserva_cancha_id: isCancha ? data.origen_id : null,
          membresia_id: !isCancha ? data.origen_id : null,
          pagado_at: new Date(),
        },
      });

      if (isCancha) {
        await tx.reserva_cancha.update({
          where: { id: data.origen_id },
          data: { estado: 'CONFIRMADA' },
        });
      } else {
        await tx.membresia.update({
          where: { id: data.origen_id },
          data: { estado: 'ACTIVO' },
        });
      }

      const comprobante = await tx.comprobante.create({
        data: {
          pago_id: nuevoPago.id,
          archivo_url: `storage/comprobantes/recibo-${nuevoPago.id}.pdf`,
        },
      });

      return {
        pago: nuevoPago,
        comprobante,
      };
    });
  }
}
