import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PagosRepository } from './pagos.repository.js';
import { ComprobantePdfService } from './comprobante-pdf.service.js';
import type { SimularPagoDto } from './dto/simular-pago.dto.js';

@Injectable()
export class PagosService {
  constructor(
    private readonly pagosRepository: PagosRepository,
    private readonly comprobantePdfService: ComprobantePdfService,
  ) {}

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
    let concepto: string;
    let detalle: string;

    if (dto.origen_tipo === 'cancha') {
      const reserva = await this.pagosRepository.findReservaCancha(dto.origen_id);
      if (!reserva) {
        throw new NotFoundException(`Reserva de cancha con ID ${dto.origen_id} no encontrada`);
      }
      const fechaTurno = reserva.fecha ? new Date(reserva.fecha).toISOString().slice(0, 10) : '';
      const nombreCancha = reserva.cancha?.nombre ?? `Cancha #${reserva.cancha_id}`;
      concepto = 'Reserva de Cancha Deportiva';
      detalle = `${nombreCancha} - ${fechaTurno} ${reserva.hora_inicio}:00 a ${reserva.hora_inicio + 1}:00 hs`;
    } else {
      const membresia = await this.pagosRepository.findMembresia(dto.origen_id);
      if (!membresia) {
        throw new NotFoundException(`Membresía con ID ${dto.origen_id} no encontrada`);
      }
      const nombrePlan = membresia.plan_membresia?.nombre ?? `Plan #${membresia.plan_id}`;
      concepto = 'Pago de Membresia';
      detalle = `Plan ${nombrePlan} (Membresia #${membresia.id})`;
    }

    const token = `tok_${randomBytes(6).toString('hex')}`;

    const { pago, comprobante } = await this.pagosRepository.procesarPago({
      origen_tipo: dto.origen_tipo,
      origen_id: dto.origen_id,
      monto: dto.monto,
      token_pasarela: token,
    });

    // RF-14: genera y guarda el PDF real en disco en la ruta registrada en comprobante.archivo_url
    const archivoRuta = this.comprobantePdfService.guardarPdf({
      pagoId: pago.id,
      concepto,
      detalle,
      monto: dto.monto,
      fecha: comprobante.emitido_at,
      tokenPasarela: token,
    });

    return {
      pago_id: pago.id,
      estado: pago.estado,
      token_pasarela: token,
      detalle: dto,
      comprobante: {
        id: comprobante.id,
        archivo_url: archivoRuta,
        descarga_url: `/pagos/${pago.id}/comprobante`,
        emitido_at: comprobante.emitido_at.toISOString(),
      },
    };
  }

  /** RF-14: devuelve el PDF del comprobante listo para descargar (lo regenera si no estaba en disco). */
  async obtenerComprobantePdf(pagoId: number): Promise<{ buffer: Buffer; filename: string }> {
    const pago = await this.findById(pagoId);
    if (!pago.comprobante) {
      throw new NotFoundException(`El pago #${pagoId} no posee un comprobante emitido`);
    }

    let buffer = this.comprobantePdfService.leerPdf(pago.comprobante.archivo_url);
    if (!buffer) {
      const concepto = pago.reserva_cancha ? 'Reserva de Cancha Deportiva' : 'Pago de Membresia';
      const detalle = pago.reserva_cancha
        ? `${pago.reserva_cancha.cancha?.nombre ?? `Cancha #${pago.reserva_cancha.cancha_id}`} - ${new Date(pago.reserva_cancha.fecha).toISOString().slice(0, 10)} ${pago.reserva_cancha.hora_inicio}:00 hs`
        : `Plan ${pago.membresia?.plan_membresia?.nombre ?? 'FitZone'} (Membresia #${pago.membresia_id})`;

      buffer = this.comprobantePdfService.generarBuffer({
        pagoId: pago.id,
        concepto,
        detalle,
        monto: Number(pago.monto),
        fecha: pago.comprobante.emitido_at,
        tokenPasarela: pago.token_pasarela ?? 'N/A',
      });
    }

    return {
      buffer,
      filename: `comprobante-pago-${pagoId}.pdf`,
    };
  }
}
