import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';
import type { PublicUser } from './users.repository.js';
import { APP_ROUTES } from '../routes/index.js';

@ApiTags('usuarios')
@Controller(APP_ROUTES.USUARIOS.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios', description: 'Retorna todos los usuarios registrados (sin hash de contraseña)' })
  @ApiOkResponse({ description: 'Listado de usuarios obtenido correctamente' })
  findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario', description: 'Registra un nuevo usuario en la base de datos' })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente' })
  create(@Body() dto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create(dto);
  }
}
