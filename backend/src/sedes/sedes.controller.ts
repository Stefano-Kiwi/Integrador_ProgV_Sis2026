import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSedeDto } from './dto/create-sede.dto.js';
import { UpdateSedeDto } from './dto/update-sede.dto.js';
import { SedesService } from './sedes.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator.js';

@ApiTags('sedes')
@Controller(APP_ROUTES.SEDES.ROOT)
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Get()
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Listar todas las sedes' })
  @ApiOkResponse({ description: 'Listado de sedes disponibles' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.sedesService.findAll(user);
  }

  @Get(APP_ROUTES.SEDES.BY_ID)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Obtener sede por ID' })
  @ApiOkResponse({ description: 'Detalle de la sede' })
  @ApiNotFoundResponse({ description: 'Sede no encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    const sede = await this.sedesService.findById(id);
    if (user.id_rol === 3 && sede.id !== await this.sedesService.sedeBaseId(user.sub)) {
      throw new ForbiddenException('Solo podés consultar tu sede.');
    }
    return sede;
  }

  @Roles('Administrador')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva sede' })
  @ApiCreatedResponse({ description: 'Sede creada exitosamente' })
  create(@Body() dto: CreateSedeDto) {
    return this.sedesService.create(dto);
  }

  @Patch(APP_ROUTES.SEDES.BY_ID)
  @Roles('Gerente', 'Administrador')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSedeDto, @CurrentUser() user: JwtPayload) {
    return this.sedesService.update(id, dto, user);
  }
}
