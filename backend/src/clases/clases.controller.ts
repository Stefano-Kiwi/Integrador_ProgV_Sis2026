import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateClaseDto } from './dto/create-clase.dto.js';
import { UpdateClaseDto } from './dto/update-clase.dto.js';
import { ReservaClaseDto } from './dto/reserva-clase.dto.js';
import { ClasesService } from './clases.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('clases')
@Controller(APP_ROUTES.CLASES.ROOT)
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clases programadas' })
  @ApiOkResponse({ description: 'Listado de clases' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.clasesService.findAll(user);
  }

  @Get(APP_ROUTES.CLASES.MI_LISTA_ESPERA)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Consultar mi lista de espera y posición actual (RF-08)',
    description:
      'Devuelve las clases en las que el usuario autenticado se encuentra EN_ESPERA junto con su posición FIFO.',
  })
  @ApiOkResponse({ description: 'Listado de entradas en lista de espera con posición actual' })
  miListaEspera(@CurrentUser('sub') usuarioId: number) {
    return this.clasesService.miListaEspera(usuarioId);
  }

  @Get(APP_ROUTES.CLASES.MIS_RESERVAS)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Consultar mis reservas de clases (RF-07)' })
  @ApiOkResponse({ description: 'Listado de reservas de clase del usuario autenticado' })
  findMisReservas(@CurrentUser('sub') usuarioId: number) {
    return this.clasesService.findReservasByUsuario(usuarioId);
  }

  @Get(APP_ROUTES.CLASES.BY_ID)
  @ApiOperation({ summary: 'Obtener detalle de una clase' })
  @ApiOkResponse({ description: 'Detalle de la clase' })
  @ApiNotFoundResponse({ description: 'Clase no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.clasesService.findById(id, user);
  }

  @Post()
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Crear una nueva clase (RF-06)' })
  @ApiCreatedResponse({ description: 'Clase programada exitosamente' })
  create(@Body() dto: CreateClaseDto, @CurrentUser() user: JwtPayload) {
    return this.clasesService.create(dto, user);
  }

  @Put(APP_ROUTES.CLASES.BY_ID)
  @Roles('Gerente', 'Administrador')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClaseDto, @CurrentUser() user: JwtPayload) {
    return this.clasesService.update(id, dto, user);
  }

  @Delete(APP_ROUTES.CLASES.BY_ID)
  @Roles('Administrador')
  delete(@Param('id', ParseIntPipe) id: number) { return this.clasesService.delete(id); }

  @Post(APP_ROUTES.CLASES.RESERVA)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Reservar clase grupal o enlistarse en espera (RF-07, RF-08, RN-03)',
    description:
      'Habilitada hasta 48 h antes del inicio y solo para socios con membresía ACTIVO (rechaza 403 si está en mora). ' +
      'Si no hay cupo disponible, agrega al socio a la lista de espera en orden FIFO.',
  })
  @ApiCreatedResponse({ description: 'Reserva confirmada o posición asignada en lista de espera' })
  @ApiBadRequestResponse({ description: 'Fuera de la ventana de 48 h o clase ya comenzada' })
  @ApiForbiddenResponse({ description: 'Socio en mora (membresía VENCIDO/SUSPENDIDO) o sin membresía activa (RN-03)' })
  @ApiConflictResponse({ description: 'Ya posee reserva confirmada o lugar en lista de espera' })
  reservar(@Body() dto: ReservaClaseDto, @CurrentUser() user: JwtPayload) {
    return this.clasesService.reservar(dto, undefined, user);
  }

  @Patch(APP_ROUTES.CLASES.CANCELAR_RESERVA)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancelar una reserva de clase (RF-07, RF-08)',
    description:
      'Sin penalidad hasta 2 h antes del inicio; con menos de 2 h se registra con penalidad. ' +
      'Al liberar el cupo, el patrón Observer promueve automáticamente al primero de la lista de espera (FIFO) en la misma transacción.',
  })
  @ApiOkResponse({ description: 'Reserva cancelada, estado de penalidad y eventual promoción de lista de espera' })
  @ApiBadRequestResponse({ description: 'La clase ya comenzó' })
  @ApiForbiddenResponse({ description: 'La reserva pertenece a otro usuario' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada' })
  @ApiConflictResponse({ description: 'La reserva ya estaba cancelada' })
  cancelarReserva(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.clasesService.cancelarReserva(id, user);
  }
}
