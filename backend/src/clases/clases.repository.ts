import { Injectable } from '@nestjs/common';
import type {
  Prisma,
  clase,
  estado_membresia,
  lista_espera_clase,
  reserva_clase,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateClaseDto } from './dto/create-clase.dto.js';
import type { UpdateClaseDto } from './dto/update-clase.dto.js';

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

  findAll(sedeId?: number) {
    return this.prisma.clase.findMany({
      ...(sedeId !== undefined ? { where: { sede_id: sedeId } } : {}),
      include: CLASE_INCLUDE,
      orderBy: { inicio_at: 'asc' },
    });
  }

  findSedeBaseId(usuarioId: number): Promise<number | null> {
    return this.prisma.usuario.findUnique({ where: { id: usuarioId }, select: { sede_base_id: true } })
      .then((usuario) => usuario?.sede_base_id ?? null);
  }

  findById(id: number) {
    return this.prisma.clase.findUnique({
      where: { id },
      include: CLASE_INCLUDE,
    });
  }

  update(id: number, dto: Partial<CreateClaseDto>) {
    return this.prisma.clase.update({ where: { id }, data: {
      ...(dto.sede_id !== undefined ? { sede_id: dto.sede_id } : {}),
      ...(dto.tipo_clase_id !== undefined ? { tipo_clase_id: dto.tipo_clase_id } : {}),
      ...(dto.instructor_id !== undefined ? { instructor_id: dto.instructor_id } : {}),
      ...(dto.inicio_at !== undefined ? { inicio_at: new Date(dto.inicio_at) } : {}),
      ...(dto.fin_at !== undefined ? { fin_at: new Date(dto.fin_at) } : {}),
      ...(dto.capacidad_maxima !== undefined ? { capacidad_maxima: dto.capacidad_maxima } : {}),
    }, include: CLASE_INCLUDE });
  }

  delete(id: number) { return this.prisma.clase.delete({ where: { id } }); }

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

  update(id: number, dto: UpdateClaseDto): Promise<clase> {
    return this.prisma.clase.update({
      where: { id },
      data: {
        ...(dto.sede_id !== undefined ? { sede_id: dto.sede_id } : {}),
        ...(dto.tipo_clase_id !== undefined ? { tipo_clase_id: dto.tipo_clase_id } : {}),
        ...(dto.instructor_id !== undefined ? { instructor_id: dto.instructor_id } : {}),
        ...(dto.inicio_at !== undefined ? { inicio_at: new Date(dto.inicio_at) } : {}),
        ...(dto.fin_at !== undefined ? { fin_at: new Date(dto.fin_at) } : {}),
        ...(dto.capacidad_maxima !== undefined ? { capacidad_maxima: dto.capacidad_maxima } : {}),
      },
      include: CLASE_INCLUDE,
    });
  }

  remove(id: number): Promise<clase> {
    return this.prisma.$transaction(async (tx) => {
      await tx.lista_espera_clase.deleteMany({ where: { clase_id: id } });
      await tx.reserva_clase.deleteMany({ where: { clase_id: id } });
      return tx.clase.delete({ where: { id } });
    });
  }

  /**
   * RN-03: devuelve 'ACTIVO' si el usuario posee al menos una membresía activa;
   * caso contrario devuelve el estado de su membresía más reciente (p. ej. VENCIDO/SUSPENDIDO)
   * o null si es cliente externo sin membresía.
   */
  async findEstadoMembresiaUsuario(usuarioId: number): Promise<estado_membresia | null> {
    const activa = await this.prisma.membresia.findFirst({
      where: { usuario_id: usuarioId, estado: 'ACTIVO' },
      select: { estado: true },
    });
    if (activa) {
      return activa.estado;
    }

    const ultima = await this.prisma.membresia.findFirst({
      where: { usuario_id: usuarioId },
      orderBy: { creada_at: 'desc' },
      select: { estado: true },
    });
    return ultima?.estado ?? null;
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

  async addToWaitlist(
    claseId: number,
    usuarioId: number,
  ): Promise<{ entry: lista_espera_clase; position: number }> {
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
        OR: [
          { creada_at: { lt: entry.creada_at } },
          { creada_at: entry.creada_at, id: { lte: entry.id } },
        ],
      },
    });

    return { entry, position };
  }

  findReservaById(id: number) {
    return this.prisma.reserva_clase.findUnique({
      where: { id },
      include: { clase: true },
    });
  }

  /**
   * Cancela la reserva, libera el cupo y ejecuta el callback de observadores (RF-08)
   * todo dentro de la misma transacción de base de datos.
   */
  async cancelarReservaYNotificar<T>(
    reservaId: number,
    claseId: number,
    conPenalidad: boolean,
    ahora: Date,
    onCupoLiberado: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<{ reserva: reserva_clase; resultadoObservers: T }> {
    return this.prisma.$transaction(async (tx) => {
      const reserva = await tx.reserva_clase.update({
        where: { id: reservaId },
        data: {
          estado: 'CANCELADA',
          cancelada_at: ahora,
          con_penalidad: conPenalidad,
        },
      });

      await tx.clase.update({
        where: { id: claseId },
        data: {
          cupo_disponible: { increment: 1 },
        },
      });

      const resultadoObservers = await onCupoLiberado(tx);
      return { reserva, resultadoObservers };
    });
  }

  /** Devuelve las entradas activas (EN_ESPERA) del usuario con su posición FIFO actual. */
  async findListaEsperaByUsuario(usuarioId: number) {
    const entradas = await this.prisma.lista_espera_clase.findMany({
      where: { usuario_id: usuarioId, estado: 'EN_ESPERA' },
      include: {
        clase: { include: CLASE_INCLUDE },
      },
      orderBy: { creada_at: 'asc' },
    });

    return Promise.all(
      entradas.map(async (entry) => {
        const posicion = await this.prisma.lista_espera_clase.count({
          where: {
            clase_id: entry.clase_id,
            estado: 'EN_ESPERA',
            OR: [
              { creada_at: { lt: entry.creada_at } },
              { creada_at: entry.creada_at, id: { lte: entry.id } },
            ],
          },
        });

        return {
          lista_espera_id: entry.id,
          clase_id: entry.clase_id,
          estado: entry.estado,
          posicion,
          creada_at: entry.creada_at,
          clase: entry.clase,
        };
      }),
    );
  }

  findReservasByUsuario(usuarioId: number) {
    return this.prisma.reserva_clase.findMany({
      where: { usuario_id: usuarioId },
      include: {
        clase: { include: CLASE_INCLUDE },
      },
      orderBy: { id: 'desc' },
    });
  }

  async cancelarClase(claseId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.reserva_clase.deleteMany({ where: { clase_id: claseId } });
      await tx.lista_espera_clase.deleteMany({ where: { clase_id: claseId } });
      await tx.clase.delete({ where: { id: claseId } });
    });
  }
}
