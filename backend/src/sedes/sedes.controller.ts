import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSedeDto } from './dto/create-sede.dto.js';
import { SedesService } from './sedes.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('sedes')
@Controller(APP_ROUTES.SEDES.ROOT)
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas las sedes' })
  @ApiOkResponse({ description: 'Listado de sedes disponibles' })
  findAll() {
    return this.sedesService.findAll();
  }

  @Public()
  @Get(APP_ROUTES.SEDES.BY_ID)
  @ApiOperation({ summary: 'Obtener sede por ID' })
  @ApiOkResponse({ description: 'Detalle de la sede' })
  @ApiNotFoundResponse({ description: 'Sede no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.sedesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sede' })
  @ApiCreatedResponse({ description: 'Sede creada exitosamente' })
  create(@Body() dto: CreateSedeDto) {
    return this.sedesService.create(dto);
  }
}
