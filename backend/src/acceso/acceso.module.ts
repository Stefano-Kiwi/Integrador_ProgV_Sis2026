import { Module } from '@nestjs/common';
import { AccesoController } from './acceso.controller.js';
import { AccesoRepository } from './acceso.repository.js';
import { AccesoService } from './acceso.service.js';

/** M2 — Gimnasio y Acceso (RF-03, RF-04, RF-05, RN-01, RNF-01). */
@Module({
  controllers: [AccesoController],
  providers: [AccesoRepository, AccesoService],
  exports: [AccesoService],
})
export class AccesoModule {}
