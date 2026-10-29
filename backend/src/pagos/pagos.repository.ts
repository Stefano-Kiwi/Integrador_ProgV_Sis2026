import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { OrigenPagoTipo } from './dto/simular-pago.dto.js';

@Injectable()
export class PagosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pago.findMany({
      include: {
        comprobante: true,
        reserva_cancha: true,
        membresia: true,
      },
      orderBy: { creado_at: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: {
        comprobante: true,
        reserva_cancha: true,
        membresia: true,
      },
    });
  }

  findReservaCancha(id: number) {
    return this.prisma.reserva_cancha.findUnique({ where: { id } });
  }

  findMembresia(id: number) {
    return this.prisma.membresia.findUnique({ where: { id } });
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
          archivo_url: `https://fitzone.com/comprobantes/recibo-${nuevoPago.id}.pdf`,
        },
      });

      return {
        pago: nuevoPago,
        comprobante,
      };
    });
  }
}
