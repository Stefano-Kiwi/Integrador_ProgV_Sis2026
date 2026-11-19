import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClasesRepository } from './clases.repository.js';
import { CupoLiberadoSubject } from './observer/index.js';
import type { CreateClaseDto } from './dto/create-clase.dto.js';
import type { ReservaClaseDto } from './dto/reserva-clase.dto.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';

/** RF-07: reserva habilitada hasta 48 horas antes; cancelación sin penalidad hasta 2 horas antes. */
export const HORAS_MAX_ANTICIPACION_RESERVA = 48;
export const HORAS_SIN_PENALIDAD_CANCELACION = 2;

const ID_ROLES_PERSONAL = [3, 4]; // Gerente, Administrador

@Injectable()
export class ClasesService {
  constructor(
    private readonly clasesRepository: ClasesRepository,
    private readonly cupoLiberadoSubject: CupoLiberadoSubject,
  ) {}

  findAll() {
    return this.clasesRepository.findAll();
  }

  async findById(id: number) {
    const clase = await this.clasesRepository.findById(id);
    if (!clase) {
      throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    }
    return clase;
  }

  create(dto: CreateClaseDto) {
    return this.clasesRepository.create(dto);
  }

  /** RF-07 + RN-03 + RF-08: reserva cupo o agrega a lista de espera si está completa. */
  async reservar(dto: ReservaClaseDto, ahora: Date = new Date()) {
    const clase = await this.findById(dto.clase_id);

    // RN-03: un socio en mora (VENCIDO / SUSPENDIDO) o sin membresía activa no puede reservar clases.
    const estadoMembresia = await this.clasesRepository.findEstadoMembresiaUsuario(dto.usuario_id);
    if (estadoMembresia === 'VENCIDO' || estadoMembresia === 'SUSPENDIDO') {
      throw new ForbiddenException(
        `Tu membresía se encuentra ${estadoMembresia.toLowerCase()}. Regularizá tu cuota para poder reservar clases grupales (RN-03).`,
      );
    }
    if (estadoMembresia !== 'ACTIVO') {
      throw new ForbiddenException(
        'Necesitás una membresía activa para reservar clases grupales.',
      );
    }

    // RF-07: la clase no debe haber comenzado y solo se puede reservar con hasta 48 h de anticipación.
    const horasHastaInicio = (new Date(clase.inicio_at).getTime() - ahora.getTime()) / 3_600_000;
    if (horasHastaInicio <= 0) {
      throw new BadRequestException('La clase ya comenzó o finalizó y no admite reservas.');
    }
    if (horasHastaInicio > HORAS_MAX_ANTICIPACION_RESERVA) {
      throw new BadRequestException(
        `Solo podés reservar una clase con hasta ${HORAS_MAX_ANTICIPACION_RESERVA} horas de anticipación.`,
      );
    }

    try {
      if (clase.cupo_disponible > 0) {
        const reserva = await this.clasesRepository.createReserva(dto.clase_id, dto.usuario_id);
        return {
          estado: 'CONFIRMADA',
          reserva_id: reserva.id,
          mensaje: 'Reserva confirmada con éxito.',
          detalle: reserva,
        };
      }

      const { entry, position } = await this.clasesRepository.addToWaitlist(
        dto.clase_id,
        dto.usuario_id,
      );
      return {
        estado: 'EN_ESPERA',
        lista_espera_id: entry.id,
        mensaje: `La clase está llena. Has sido agregado a la lista de espera (Posición ${position}).`,
        posicion: position,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'Ya tenés una reserva confirmada o un lugar activo en la lista de espera para esta clase.',
        );
      }
      throw error;
    }
  }

  /**
   * RF-07 + RF-08: cancela una reserva (sin penalidad hasta 2 h antes; con penalidad después),
   * libera el cupo y notifica al Subject para promover al primero de la lista de espera en la misma transacción.
   */
  async cancelarReserva(reservaId: number, user: JwtPayload, ahora: Date = new Date()) {
    const reserva = await this.clasesRepository.findReservaById(reservaId);
    if (!reserva) {
      throw new NotFoundException(`Reserva de clase con ID ${reservaId} no encontrada`);
    }

    const esPersonal = ID_ROLES_PERSONAL.includes(user.id_rol);
    if (reserva.usuario_id !== user.sub && !esPersonal) {
      throw new ForbiddenException('Solo podés cancelar tus propias reservas de clase.');
    }

    if (reserva.estado !== 'CONFIRMADA') {
      throw new ConflictException(`La reserva ya se encuentra en estado ${reserva.estado}.`);
    }

    const horasHastaInicio =
      (new Date(reserva.clase.inicio_at).getTime() - ahora.getTime()) / 3_600_000;
    if (horasHastaInicio <= 0) {
      throw new BadRequestException('No se puede cancelar una reserva de una clase que ya comenzó.');
    }

    const conPenalidad = horasHastaInicio < HORAS_SIN_PENALIDAD_CANCELACION;

    const { resultadoObservers } = await this.clasesRepository.cancelarReservaYNotificar(
      reservaId,
      reserva.clase_id,
      conPenalidad,
      ahora,
      (tx) =>
        this.cupoLiberadoSubject.notify({
          claseId: reserva.clase_id,
          reservaCanceladaId: reservaId,
          tx,
        }),
    );

    const promovido = resultadoObservers[0] ?? null;

    return {
      reserva_id: reservaId,
      estado: 'CANCELADA',
      con_penalidad: conPenalidad,
      mensaje: conPenalidad
        ? `Cancelación registrada con penalidad (menos de ${HORAS_SIN_PENALIDAD_CANCELACION} h de anticipación).`
        : 'Cancelación registrada sin penalidad.',
      promovido_desde_lista_espera: promovido,
    };
  }

  /** Consulta las clases en las que el usuario autenticado está en lista de espera y su posición FIFO. */
  miListaEspera(usuarioId: number) {
    return this.clasesRepository.findListaEsperaByUsuario(usuarioId);
  }

  findReservasByUsuario(usuarioId: number) {
    return this.clasesRepository.findReservasByUsuario(usuarioId);
  }
}
