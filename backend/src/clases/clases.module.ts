import { Module } from '@nestjs/common';
import { ClasesController } from './clases.controller.js';
import { ClasesRepository } from './clases.repository.js';
import { ClasesService } from './clases.service.js';

@Module({
  controllers: [ClasesController],
  providers: [ClasesRepository, ClasesService],
  exports: [ClasesService],
})
export class ClasesModule {}
