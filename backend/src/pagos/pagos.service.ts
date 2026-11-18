import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PagosRepository } from './pagos.repository.js';
import type { SimularPagoDto } from './dto/simular-pago.dto.js';

@Injectable()
export class PagosService {
  constructor(private readonly pagosRepository: PagosRepository) {}

  findAll() {
    return this.pagosRepository.findAll();
  }

  async findById(id: number) {
    const pago = await this.pagosRepository.findById(id);
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return pago;
  }

  async simularPago(dto: SimularPagoDto) {
    if (dto.origen_tipo === 'cancha') {
      const reserva = await this.pagosRepository.findReservaCancha(dto.origen_id);
      if (!reserva) {
        throw new NotFoundException(`Reserva de cancha con ID ${dto.origen_id} no encontrada`);
      }
    } else {
      const membresia = await this.pagosRepository.findMembresia(dto.origen_id);
      if (!membresia) {
        throw new NotFoundException(`Membresía con ID ${dto.origen_id} no encontrada`);
      }
    }

    const token = `tok_${randomBytes(6).toString('hex')}`;

    const { pago, comprobante } = await this.pagosRepository.procesarPago({
      origen_tipo: dto.origen_tipo,
      origen_id: dto.origen_id,
      monto: dto.monto,
      token_pasarela: token,
    });

    return {
      pago_id: pago.id,
      estado: pago.estado,
      token_pasarela: token,
      detalle: dto,
      comprobante: {
        id: comprobante.id,
        archivo_url: comprobante.archivo_url,
        emitido_at: comprobante.emitido_at.toISOString(),
      },
    };
  }
}
