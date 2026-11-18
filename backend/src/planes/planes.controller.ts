import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { PlanesService } from './planes.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('planes')
@Controller(APP_ROUTES.PLANES.ROOT)
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar planes de membresía' })
  @ApiOkResponse({ description: 'Listado de planes activos' })
  findAll() {
    return this.planesService.findAll();
  }

  @Public()
  @Get(APP_ROUTES.PLANES.BY_ID)
  @ApiOperation({ summary: 'Obtener plan por ID' })
  @ApiOkResponse({ description: 'Detalle del plan' })
  @ApiNotFoundResponse({ description: 'Plan no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.planesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo plan de membresía' })
  @ApiCreatedResponse({ description: 'Plan creado exitosamente' })
  create(@Body() dto: CreatePlanDto) {
    return this.planesService.create(dto);
  }
}
