import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CanchasRepository } from './canchas.repository.js';
import type { CreateCanchaDto } from './dto/create-cancha.dto.js';
import type { ReservaCanchaDto } from './dto/reserva-cancha.dto.js';

@Injectable()
export class CanchasService {
  constructor(private readonly canchasRepository: CanchasRepository) {}

  findAll() {
    return this.canchasRepository.findAll();
  }

  async findById(id: number) {
    const cancha = await this.canchasRepository.findById(id);
    if (!cancha) {
      throw new NotFoundException(`Cancha con ID ${id} no encontrada`);
    }
    return cancha;
  }

  create(dto: CreateCanchaDto) {
    return this.canchasRepository.create(dto);
  }

  async reservar(dto: ReservaCanchaDto) {
    const cancha = await this.findById(dto.cancha_id);

    if (cancha.estado !== 'HABILITADA') {
      throw new BadRequestException('La cancha no está disponible para reservas (se encuentra en mantenimiento)');
    }

    const fechaDate = new Date(dto.fecha);

    const existingReserva = await this.canchasRepository.findReservaByTurno(
      dto.cancha_id,
      fechaDate,
      dto.hora_inicio,
    );

    if (existingReserva) {
      throw new ConflictException('El turno seleccionado ya se encuentra reservado');
    }

    const costoHora = Number(cancha.costo_hora);

    const reserva = await this.canchasRepository.createReserva({
      cancha_id: dto.cancha_id,
      usuario_id: dto.usuario_id,
      fecha: fechaDate,
      hora_inicio: dto.hora_inicio,
      precio_base: costoHora,
      monto_total: costoHora,
    });

    return {
      reserva_id: reserva.id,
      estado: reserva.estado,
      monto_total: reserva.monto_total,
      mensaje: 'Turno bloqueado. Pendiente de pago.',
      detalle: reserva,
    };
  }
}
