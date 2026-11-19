import { Injectable } from '@nestjs/common';
import type { estado_membresia } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

const MEMBRESIA_INCLUDE = {
  plan_membresia: true,
} as const;

@Injectable()
export class MembresiasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPlanById(planId: number) {
    return this.prisma.plan_membresia.findUnique({ where: { id: planId } });
  }

  findById(id: number) {
    return this.prisma.membresia.findUnique({
      where: { id },
      include: MEMBRESIA_INCLUDE,
    });
  }

  findUltimaByUsuario(usuarioId: number) {
    return this.prisma.membresia.findFirst({
      where: { usuario_id: usuarioId },
      orderBy: { creada_at: 'desc' },
      include: MEMBRESIA_INCLUDE,
    });
  }

  create(data: {
    usuario_id: number;
    plan_id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: estado_membresia;
    renovacion_automatica: boolean;
  }) {
    return this.prisma.membresia.create({
      data,
      include: MEMBRESIA_INCLUDE,
    });
  }

  update(
    id: number,
    data: Partial<{
      plan_id: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      estado: estado_membresia;
      renovacion_automatica: boolean;
    }>,
  ) {
    return this.prisma.membresia.update({
      where: { id },
      data,
      include: MEMBRESIA_INCLUDE,
    });
  }

  /** RF-02: marca como VENCIDO todas las membresías ACTIVAS cuya fecha_fin ya pasó. */
  async marcarVencidas(ahora: Date): Promise<number> {
    const res = await this.prisma.membresia.updateMany({
      where: {
        estado: 'ACTIVO',
        fecha_fin: { lt: ahora },
      },
      data: { estado: 'VENCIDO' },
    });
    return res.count;
  }
}
