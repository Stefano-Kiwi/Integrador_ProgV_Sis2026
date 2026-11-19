import { Injectable } from '@nestjs/common';
import type { acceso, sede } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AccesoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async tieneMembresiaActiva(usuarioId: number): Promise<boolean> {
    const count = await this.prisma.membresia.count({
      where: { usuario_id: usuarioId, estado: 'ACTIVO' },
    });
    return count > 0;
  }

  findSedeById(sedeId: number): Promise<sede | null> {
    return this.prisma.sede.findUnique({ where: { id: sedeId } });
  }

  findAccesoActivo(usuarioId: number): Promise<acceso | null> {
    return this.prisma.acceso.findFirst({
      where: { usuario_id: usuarioId, egreso_at: null },
    });
  }

  findAccesoPorClaveOffline(
    usuarioId: number,
    sedeId: number,
    ingresoAt: Date,
  ): Promise<acceso | null> {
    return this.prisma.acceso.findFirst({
      where: {
        usuario_id: usuarioId,
        sede_id: sedeId,
        ingreso_at: ingresoAt,
      },
    });
  }

  createIngreso(usuarioId: number, sedeId: number, ingresoAt?: Date): Promise<acceso> {
    return this.prisma.acceso.create({
      data: {
        usuario_id: usuarioId,
        sede_id: sedeId,
        ...(ingresoAt ? { ingreso_at: ingresoAt } : {}),
      },
    });
  }

  registrarEgreso(accesoId: number, egresoAt: Date): Promise<acceso> {
    return this.prisma.acceso.update({
      where: { id: accesoId },
      data: { egreso_at: egresoAt },
    });
  }

  contarAforoActual(sedeId: number): Promise<number> {
    return this.prisma.acceso.count({
      where: { sede_id: sedeId, egreso_at: null },
    });
  }

  /**
   * RNF-01: devuelve el conjunto mínimo de datos de socios activos de toda la cadena
   * (RF-03 multi-sede) para que el terminal de sede pueda validar ingresos offline.
   */
  findSociosActivosSnapshot() {
    return this.prisma.membresia.findMany({
      where: { estado: 'ACTIVO' },
      select: {
        estado: true,
        fecha_fin: true,
        usuario: {
          select: {
            id: true,
            dni: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }
}
