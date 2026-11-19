import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import type { PublicUser } from './users.repository.js';
import { APP_ROUTES } from '../routes/index.js';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator.js';

@ApiTags('usuarios')
@ApiBearerAuth('access-token')
@Controller(APP_ROUTES.USUARIOS.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios (RF-01)',
    description: 'Retorna todos los usuarios registrados (sin hash), indicando tipo_usuario (SOCIO / CLIENTE_EXTERNO).',
  })
  @ApiOkResponse({ description: 'Listado de usuarios obtenido correctamente' })
  findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  @Get(APP_ROUTES.USUARIOS.BY_ID)
  @ApiOperation({ summary: 'Obtener perfil de un usuario por ID (RF-01)' })
  @ApiOkResponse({ description: 'Perfil del usuario con tipo_usuario (SOCIO / CLIENTE_EXTERNO)' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario (RF-01)', description: 'Registra un nuevo usuario en la base de datos' })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente' })
  create(@Body() dto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create(dto);
  }

  @Patch(APP_ROUTES.USUARIOS.BY_ID)
  @ApiOperation({
    summary: 'Actualizar perfil de usuario (RF-01)',
    description: 'Permite al propio usuario o a personal autorizado actualizar nombre, apellido, email, teléfono, foto o sede base.',
  })
  @ApiOkResponse({ description: 'Perfil actualizado correctamente' })
  @ApiForbiddenResponse({ description: 'No tenés permiso para modificar otro perfil' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<PublicUser> {
    return this.usersService.update(id, dto, currentUser);
  }
}
