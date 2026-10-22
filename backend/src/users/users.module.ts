import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

@Module({
  providers: [UsersRepository, UsersService],
  exports: [UsersService], // el repository queda privado: otros módulos solo ven el service
})
export class UsersModule {}
