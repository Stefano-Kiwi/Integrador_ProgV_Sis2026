import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCanchaDto } from './dto/create-cancha.dto.js';
import { ReservaCanchaDto } from './dto/reserva-cancha.dto.js';
import { CanchasService } from './canchas.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('canchas')
@Controller(APP_ROUTES.CANCHAS.ROOT)
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas las canchas deportivas' })
  @ApiOkResponse({ description: 'Listado de canchas disponibles' })
  findAll() {
    return this.canchasService.findAll();
  }

  @Public()
  @Get(APP_ROUTES.CANCHAS.BY_ID)
  @ApiOperation({ summary: 'Obtener detalle de una cancha por ID' })
  @ApiOkResponse({ description: 'Detalle de la cancha' })
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.canchasService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva cancha' })
  @ApiCreatedResponse({ description: 'Cancha registrada exitosamente' })
  create(@Body() dto: CreateCanchaDto) {
    return this.canchasService.create(dto);
  }

  @Post(APP_ROUTES.CANCHAS.RESERVA)
  @ApiOperation({ summary: 'Reservar turno de cancha deportiva' })
  @ApiCreatedResponse({ description: 'Turno bloqueado pendiente de pago' })
  @ApiConflictResponse({ description: 'El turno ya se encuentra ocupado' })
  reservar(@Body() dto: ReservaCanchaDto) {
    return this.canchasService.reservar(dto);
  }
}
