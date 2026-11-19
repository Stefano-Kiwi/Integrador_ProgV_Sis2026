import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSedeDto } from './dto/create-sede.dto.js';
import { SedesService } from './sedes.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator.js';

@ApiTags('sedes')
@Controller(APP_ROUTES.SEDES.ROOT)
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar sedes (un Gerente solo recibe su sede asignada)',
  })
  @ApiOkResponse({ description: 'Listado de sedes disponibles' })
  findAll(@CurrentUser() user?: JwtPayload) {
    return this.sedesService.findAll(user);
  }

  @Public()
  @Get(APP_ROUTES.SEDES.BY_ID)
  @ApiOperation({ summary: 'Obtener sede por ID (403 si un Gerente consulta otra sede)' })
  @ApiOkResponse({ description: 'Detalle de la sede' })
  @ApiForbiddenResponse({ description: 'El gerente solo puede consultar su propia sede' })
  @ApiNotFoundResponse({ description: 'Sede no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: JwtPayload) {
    return this.sedesService.findById(id, user);
  }

  @Roles('Administrador')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva sede (solo Administrador)' })
  @ApiCreatedResponse({ description: 'Sede creada exitosamente' })
  create(@Body() dto: CreateSedeDto) {
    return this.sedesService.create(dto);
  }
}
