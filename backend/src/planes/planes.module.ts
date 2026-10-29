import { Module } from '@nestjs/common';
import { PlanesController } from './planes.controller.js';
import { PlanesRepository } from './planes.repository.js';
import { PlanesService } from './planes.service.js';

@Module({
  controllers: [PlanesController],
  providers: [PlanesRepository, PlanesService],
  exports: [PlanesService],
})
export class PlanesModule {}
