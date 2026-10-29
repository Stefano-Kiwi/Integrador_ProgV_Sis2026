import { Injectable, NotFoundException } from '@nestjs/common';
import { ClasesRepository } from './clases.repository.js';
import type { CreateClaseDto } from './dto/create-clase.dto.js';
import type { ReservaClaseDto } from './dto/reserva-clase.dto.js';

@Injectable()
export class ClasesService {
  constructor(private readonly clasesRepository: ClasesRepository) {}

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

  async reservar(dto: ReservaClaseDto) {
    const clase = await this.findById(dto.clase_id);

    if (clase.cupo_disponible > 0) {
      const reserva = await this.clasesRepository.createReserva(dto.clase_id, dto.usuario_id);
      return {
        estado: 'CONFIRMADA',
        reserva_id: reserva.id,
        mensaje: 'Reserva confirmada con éxito.',
        detalle: reserva,
      };
    }

    const { entry, position } = await this.clasesRepository.addToWaitlist(dto.clase_id, dto.usuario_id);
    return {
      estado: 'EN_ESPERA',
      lista_espera_id: entry.id,
      mensaje: `La clase está llena. Has sido agregado a la lista de espera (Posición ${position}).`,
      posicion: position,
    };
  }
}
