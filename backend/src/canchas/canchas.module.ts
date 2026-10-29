import { Module } from '@nestjs/common';
import { CanchasController } from './canchas.controller.js';
import { CanchasRepository } from './canchas.repository.js';
import { CanchasService } from './canchas.service.js';

@Module({
  controllers: [CanchasController],
  providers: [CanchasRepository, CanchasService],
  exports: [CanchasService],
})
export class CanchasModule {}
