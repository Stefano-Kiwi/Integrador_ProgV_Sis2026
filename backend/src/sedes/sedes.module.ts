import { Module } from '@nestjs/common';
import { SedesController } from './sedes.controller.js';
import { SedesRepository } from './sedes.repository.js';
import { SedesService } from './sedes.service.js';

@Module({
  controllers: [SedesController],
  providers: [SedesRepository, SedesService],
  exports: [SedesService],
})
export class SedesModule {}
