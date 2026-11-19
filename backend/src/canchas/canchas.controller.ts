import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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
import { CreateCanchaDto } from './dto/create-cancha.dto.js';
import { ReservaCanchaDto } from './dto/reserva-cancha.dto.js';
import { DisponibilidadQueryDto, DisponibilidadResponseDto } from './dto/disponibilidad.dto.js';
import { UpdateEstadoCanchaDto } from './dto/update-estado-cancha.dto.js';
import { CanchasService } from './canchas.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator.js';

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

  @Get(APP_ROUTES.CANCHAS.RESERVAS)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Listar todas las reservas de canchas' })
  @ApiOkResponse({ description: 'Listado de reservas con datos del usuario y la cancha' })
  findAllReservas() {
    return this.canchasService.findAllReservas();
  }

  @Get(APP_ROUTES.CANCHAS.MIS_RESERVAS)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar mis reservas de canchas' })
  @ApiOkResponse({ description: 'Listado de reservas del usuario autenticado' })
  findMisReservas(@CurrentUser('sub') usuarioId: number) {
    return this.canchasService.findReservasByUsuario(usuarioId);
  }

  @Get(APP_ROUTES.CANCHAS.DISPONIBILIDAD)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Grilla horaria de disponibilidad de una cancha (RF-10, RF-11)',
    description:
      'Devuelve las franjas del día (LIBRE / OCUPADA / MANTENIMIENTO) con el precio calculado por las ' +
      'estrategias de tarifa para el usuario autenticado (descuento de socio, recargo en horario pico, tarifa de externo).',
  })
  @ApiOkResponse({ type: DisponibilidadResponseDto })
  @ApiBadRequestResponse({ description: 'Fecha con formato inválido' })
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  disponibilidad(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: DisponibilidadQueryDto,
    @CurrentUser('sub') usuarioId: number,
  ) {
    return this.canchasService.disponibilidad(id, query.fecha, usuarioId);
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
  @ApiOperation({
    summary: 'Reservar turno de cancha deportiva (RF-10)',
    description:
      'El precio se calcula con las estrategias de tarifa (RF-11). Un usuario sin membresía ACTIVO ' +
      '(cliente externo, o socio con membresía VENCIDO/SUSPENDIDO) paga tarifa de externo (RN-03). ' +
      'La no sobreventa (RN-02) está garantizada por el índice único parcial ux_reserva_cancha_slot.',
  })
  @ApiCreatedResponse({ description: 'Turno bloqueado pendiente de pago, con el desglose de precio' })
  @ApiConflictResponse({ description: 'El turno ya se encuentra ocupado (409)' })
  @ApiBadRequestResponse({ description: 'La cancha está en mantenimiento' })
  reservar(@Body() dto: ReservaCanchaDto) {
    return this.canchasService.reservar(dto);
  }

  @Patch(APP_ROUTES.CANCHAS.CANCELAR_RESERVA)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancelar una reserva de cancha',
    description:
      'Estados: PENDIENTE_PAGO → CONFIRMADA → CUMPLIDA / CANCELADA. Sin penalidad si faltan 24 h o más, ' +
      'o si la reserva aún no se pagó. Con menos de 24 h y reserva pagada se retiene el 50% del monto.',
  })
  @ApiOkResponse({ description: 'Reserva cancelada, con indicación de penalidad y monto reembolsable' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada' })
  @ApiForbiddenResponse({ description: 'La reserva pertenece a otro usuario' })
  @ApiConflictResponse({ description: 'La reserva ya está CANCELADA o CUMPLIDA' })
  cancelar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.canchasService.cancelar(id, user);
  }

  @Patch(APP_ROUTES.CANCHAS.ESTADO)
  @Roles('Gerente', 'Administrador')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Habilitar o inhabilitar una cancha por mantenimiento (RF-12)',
    description: 'Con EN_MANTENIMIENTO se bloquean las reservas futuras; las reservas ya existentes no se modifican.',
  })
  @ApiOkResponse({ description: 'Cancha con su nuevo estado' })
  @ApiNotFoundResponse({ description: 'Cancha no encontrada' })
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoCanchaDto) {
    return this.canchasService.cambiarEstado(id, dto.estado);
  }
}
