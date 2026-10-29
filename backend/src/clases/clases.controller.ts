import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClaseDto } from './dto/create-clase.dto.js';
import { ReservaClaseDto } from './dto/reserva-clase.dto.js';
import { ClasesService } from './clases.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('clases')
@Controller(APP_ROUTES.CLASES.ROOT)
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar clases programadas' })
  @ApiOkResponse({ description: 'Listado de clases' })
  findAll() {
    return this.clasesService.findAll();
  }

  @Public()
  @Get(APP_ROUTES.CLASES.BY_ID)
  @ApiOperation({ summary: 'Obtener detalle de una clase' })
  @ApiOkResponse({ description: 'Detalle de la clase' })
  @ApiNotFoundResponse({ description: 'Clase no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.clasesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva clase' })
  @ApiCreatedResponse({ description: 'Clase programada exitosamente' })
  create(@Body() dto: CreateClaseDto) {
    return this.clasesService.create(dto);
  }

  @Post(APP_ROUTES.CLASES.RESERVA)
  @ApiOperation({ summary: 'Reservar clase deportiva', description: 'Reserva cupo en la clase o ingresa a lista de espera si está llena' })
  @ApiCreatedResponse({ description: 'Reserva confirmada o posición asignada en lista de espera' })
  reservar(@Body() dto: ReservaClaseDto) {
    return this.clasesService.reservar(dto);
  }
}
