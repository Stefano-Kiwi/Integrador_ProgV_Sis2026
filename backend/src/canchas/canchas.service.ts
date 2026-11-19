import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CanchasRepository } from './canchas.repository.js';
import { PricingService, type PrecioCalculado } from './pricing/index.js';
import {
  HORAS_SIN_PENALIDAD,
  HORA_APERTURA,
  HORA_CIERRE,
  PENALIDAD_PORCENTAJE,
  puedeTransicionar,
} from './reserva-reglas.js';
import type { CreateCanchaDto } from './dto/create-cancha.dto.js';
import type { ReservaCanchaDto } from './dto/reserva-cancha.dto.js';
import type { EstadoCanchaValor } from './dto/update-estado-cancha.dto.js';
import type { DisponibilidadResponseDto } from './dto/disponibilidad.dto.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';
import { obtenerSedeRestringida, validarAccesoASede } from '../common/auth/branch-scope.js';

/** id_rol del personal (Gerente, Administrador) según el mapa de roles de roles.guard.ts. */
const ID_ROLES_PERSONAL = [3, 4];

const redondear = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;

@Injectable()
export class CanchasService {
  constructor(
    private readonly canchasRepository: CanchasRepository,
    private readonly pricingService: PricingService,
  ) {}

  async findAll(user?: JwtPayload) {
    const sedeId = obtenerSedeRestringida(user);
    if (sedeId !== null) {
      return this.canchasRepository.findAll(sedeId);
    }
    return this.canchasRepository.findAll();
  }

  async findAllReservas(user?: JwtPayload) {
    const sedeId = obtenerSedeRestringida(user);
    if (sedeId !== null) {
      return this.canchasRepository.findAllReservas(sedeId);
    }
    return this.canchasRepository.findAllReservas();
  }

  findReservasByUsuario(usuarioId: number) {
    return this.canchasRepository.findReservasByUsuario(usuarioId);
  }

  async findById(id: number, user?: JwtPayload) {
    const cancha = await this.canchasRepository.findById(id);
    if (!cancha) {
      throw new NotFoundException(`Cancha con ID ${id} no encontrada`);
    }
    validarAccesoASede(user, cancha.sede_id);
    return cancha;
  }

  async create(dto: CreateCanchaDto, user?: JwtPayload) {
    validarAccesoASede(user, dto.sede_id);
    return this.canchasRepository.create(dto);
  }

  async update(id: number, dto: Partial<CreateCanchaDto>, user?: JwtPayload) {
    const cancha = await this.findById(id, user);
    validarAccesoASede(user, cancha.sede_id);
    if (dto.sede_id !== undefined) {
      validarAccesoASede(user, dto.sede_id);
    }
    return this.canchasRepository.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.canchasRepository.delete(id);
  }

  async remove(id: number) {
    return this.delete(id);
  }

  /** Calcula el precio de un turno con las estrategias (RF-11). RN-03: sin membresía ACTIVO paga como externo. */
  private async calcularPrecio(costoHora: number, horaInicio: number, usuarioId: number): Promise<PrecioCalculado> {
    const esSocioActivo = await this.canchasRepository.usuarioEsSocioActivo(usuarioId);
    return this.pricingService.calcular({ costoHora, horaInicio, esSocioActivo });
  }

  async reservar(dto: ReservaCanchaDto, user?: JwtPayload) {
    const cancha = await this.findById(dto.cancha_id, user);

    if (cancha.estado !== 'HABILITADA') {
      throw new BadRequestException('La cancha no está disponible para reservas (se encuentra en mantenimiento)');
    }

    const fechaDate = new Date(dto.fecha);

    // Validación amistosa: da un mensaje claro en el caso común. NO es la protección contra
    // la sobreventa: dos pedidos simultáneos pueden pasarla; la garantía es el índice único (abajo).
    const existingReserva = await this.canchasRepository.findReservaByTurno(
      dto.cancha_id,
      fechaDate,
      dto.hora_inicio,
    );
    if (existingReserva) {
      throw new ConflictException('El turno seleccionado ya se encuentra reservado');
    }

    const precio = await this.calcularPrecio(Number(cancha.costo_hora), dto.hora_inicio, dto.usuario_id);

    let reserva;
    try {
      reserva = await this.canchasRepository.createReserva({
        cancha_id: dto.cancha_id,
        usuario_id: dto.usuario_id,
        fecha: fechaDate,
        hora_inicio: dto.hora_inicio,
        precio_base: precio.precio_base,
        descuento: precio.descuento,
        recargo: precio.recargo,
        monto_total: precio.monto_total,
      });
    } catch (error) {
      // RN-02: el índice único parcial ux_reserva_cancha_slot rechazó el turno duplicado.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El turno seleccionado ya se encuentra reservado');
      }
      throw error;
    }

    return {
      reserva_id: reserva.id,
      estado: reserva.estado,
      monto_total: reserva.monto_total,
      precio,
      mensaje: 'Turno bloqueado. Pendiente de pago.',
      detalle: reserva,
    };
  }

  /** RF-10: grilla horaria del día con franjas libres/ocupadas y el precio calculado por las estrategias. */
  async disponibilidad(canchaId: number, fecha: string, usuarioId: number, user: JwtPayload): Promise<DisponibilidadResponseDto> {
    const fechaDate = new Date(fecha);
    if (Number.isNaN(fechaDate.getTime())) {
      throw new BadRequestException('La fecha no es válida (formato esperado: YYYY-MM-DD)');
    }

    const cancha = await this.findById(canchaId, user);
    const [reservas, esSocioActivo] = await Promise.all([
      this.canchasRepository.findReservasActivasByFecha(canchaId, fechaDate),
      this.canchasRepository.usuarioEsSocioActivo(usuarioId),
    ]);

    const ocupadas = new Set(reservas.map((r) => r.hora_inicio));
    const habilitada = cancha.estado === 'HABILITADA';
    const costoHora = Number(cancha.costo_hora);

    const franjas = [];
    for (let hora = HORA_APERTURA; hora < HORA_CIERRE; hora++) {
      const estado = ocupadas.has(hora) ? 'OCUPADA' : habilitada ? 'LIBRE' : 'MANTENIMIENTO';
      franjas.push({
        hora_inicio: hora,
        hora_fin: hora + 1,
        estado,
        precio: this.pricingService.calcular({ costoHora, horaInicio: hora, esSocioActivo }),
      } as const);
    }

    return { cancha_id: canchaId, fecha, cancha_estado: cancha.estado, franjas: [...franjas] };
  }

  /**
   * Cancela una reserva (PENDIENTE_PAGO o CONFIRMADA). Penalidad: si la reserva ya estaba pagada
   * y faltan menos de 24 h para el turno, se retiene el 50% del monto.
   */
  async cancelar(reservaId: number, user: JwtPayload, ahora: Date = new Date()) {
    const reserva = await this.canchasRepository.findReservaById(reservaId);
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
    }

    const esPersonal = ID_ROLES_PERSONAL.includes(user.id_rol);
    if (reserva.usuario_id !== user.sub && !esPersonal) {
      throw new ForbiddenException('Solo podés cancelar tus propias reservas');
    }

    if (!puedeTransicionar(reserva.estado, 'CANCELADA')) {
      throw new ConflictException(`No se puede cancelar una reserva en estado ${reserva.estado}`);
    }

    const f = reserva.fecha;
    const inicioTurno = new Date(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate(), reserva.hora_inicio);
    const horasAntes = (inicioTurno.getTime() - ahora.getTime()) / 3_600_000;
    if (horasAntes <= 0) {
      throw new BadRequestException('No se puede cancelar un turno que ya comenzó');
    }

    const montoTotal = Number(reserva.monto_total);
    const yaPagada = reserva.estado === 'CONFIRMADA';
    const conPenalidad = yaPagada && horasAntes < HORAS_SIN_PENALIDAD;
    const penalidad = conPenalidad ? redondear(montoTotal * PENALIDAD_PORCENTAJE) : 0;

    await this.canchasRepository.cancelarReserva(reservaId, penalidad);

    return {
      reserva_id: reservaId,
      estado: 'CANCELADA',
      con_penalidad: conPenalidad,
      penalidad,
      monto_reembolsable: yaPagada ? redondear(montoTotal - penalidad) : 0,
      mensaje: conPenalidad
        ? `Cancelación con penalidad: faltan menos de ${HORAS_SIN_PENALIDAD} h para el turno.`
        : 'Cancelación sin penalidad.',
    };
  }

  /** RF-12: habilita o inhabilita la cancha. No modifica reservas ya existentes. */
  async cambiarEstado(id: number, estado: EstadoCanchaValor, user?: JwtPayload) {
    const cancha = await this.findById(id, user);
    validarAccesoASede(user, cancha.sede_id);
    return this.canchasRepository.updateEstado(id, estado);
  }
}
