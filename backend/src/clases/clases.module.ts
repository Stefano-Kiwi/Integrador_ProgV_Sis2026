import { Module } from '@nestjs/common';
import { ClasesController } from './clases.controller.js';
import { ClasesRepository } from './clases.repository.js';
import { ClasesService } from './clases.service.js';
import {
  CupoLiberadoSubject,
  ListaEsperaObserver,
  NotificacionesService,
} from './observer/index.js';

@Module({
  controllers: [ClasesController],
  providers: [
    ClasesRepository,
    ClasesService,
    CupoLiberadoSubject,
    NotificacionesService,
    ListaEsperaObserver,
  ],
  exports: [ClasesService],
})
export class ClasesModule {}
