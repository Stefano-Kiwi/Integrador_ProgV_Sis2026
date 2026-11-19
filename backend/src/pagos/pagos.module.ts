import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller.js';
import { PagosRepository } from './pagos.repository.js';
import { PagosService } from './pagos.service.js';
import { ComprobantePdfService } from './comprobante-pdf.service.js';

@Module({
  controllers: [PagosController],
  providers: [PagosRepository, PagosService, ComprobantePdfService],
  exports: [PagosService],
})
export class PagosModule {}
