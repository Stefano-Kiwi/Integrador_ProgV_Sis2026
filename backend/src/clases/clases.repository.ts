import { Injectable } from '@nestjs/common';
import type { clase, lista_espera_clase, reserva_clase } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateClaseDto } from './dto/create-clase.dto.js';

export const CLASE_INCLUDE = {
  tipo_clase: true,
  instructor: {
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
    },
  },
  sede: true,
} as const;

@Injectable()
export class ClasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.clase.findMany({
      include: CLASE_INCLUDE,
      orderBy: { inicio_at: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.clase.findUnique({
      where: { id },
      include: CLASE_INCLUDE,
    });
  }

  create(dto: CreateClaseDto): Promise<clase> {
    return this.prisma.clase.create({
      data: {
        tipo_clase_id: dto.tipo_clase_id,
        instructor_id: dto.instructor_id,
        sede_id: dto.sede_id,
        capacidad_maxima: dto.capacidad_maxima,
        cupo_disponible: dto.capacidad_maxima,
        inicio_at: new Date(dto.inicio_at),
        fin_at: new Date(dto.fin_at),
      },
      include: CLASE_INCLUDE,
    });
  }

  async createReserva(claseId: number, usuarioId: number): Promise<reserva_clase> {
    return this.prisma.$transaction(async (tx) => {
      await tx.clase.update({
        where: { id: claseId },
        data: {
          cupo_disponible: { decrement: 1 },
        },
      });

      return tx.reserva_clase.create({
        data: {
          clase_id: claseId,
          usuario_id: usuarioId,
          estado: 'CONFIRMADA',
        },
      });
    });
  }

  async addToWaitlist(claseId: number, usuarioId: number): Promise<{ entry: lista_espera_clase; position: number }> {
    const entry = await this.prisma.lista_espera_clase.create({
      data: {
        clase_id: claseId,
        usuario_id: usuarioId,
        estado: 'EN_ESPERA',
      },
    });

    const position = await this.prisma.lista_espera_clase.count({
      where: {
        clase_id: claseId,
        estado: 'EN_ESPERA',
        creada_at: { lte: entry.creada_at },
      },
    });

    return { entry, position };
  }
}
