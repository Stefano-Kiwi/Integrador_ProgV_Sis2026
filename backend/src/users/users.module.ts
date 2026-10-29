import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService], // el repository queda privado: otros módulos solo ven el service
})
export class UsersModule {}

