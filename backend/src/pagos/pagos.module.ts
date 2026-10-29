import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller.js';
import { PagosRepository } from './pagos.repository.js';
import { PagosService } from './pagos.service.js';

@Module({
  controllers: [PagosController],
  providers: [PagosRepository, PagosService],
  exports: [PagosService],
})
export class PagosModule {}
