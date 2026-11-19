import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { MembresiasController } from './membresias/membresias.controller.js';
import { MembresiasRepository } from './membresias/membresias.repository.js';
import { MembresiasService } from './membresias/membresias.service.js';

@Module({
  controllers: [UsersController, MembresiasController],
  providers: [UsersRepository, UsersService, MembresiasRepository, MembresiasService],
  exports: [UsersService, MembresiasService],
})
export class UsersModule {}
