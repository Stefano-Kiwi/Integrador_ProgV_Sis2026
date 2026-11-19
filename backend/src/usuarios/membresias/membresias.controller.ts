import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
import { MembresiasService } from './membresias.service.js';
import { ContratarMembresiaDto, RenovarMembresiaDto } from './dto/membresia.dto.js';
import { APP_ROUTES } from '../../routes/index.js';
import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('membresias')
@ApiBearerAuth('access-token')
@Controller(APP_ROUTES.MEMBRESIAS.ROOT)
export class MembresiasController {
  constructor(private readonly membresiasService: MembresiasService) {}

  @Post()
  @ApiOperation({
    summary: 'Contratar un plan de membresía (RF-02)',
    description: 'Crea una membresía en estado PENDIENTE_PAGO (se activa al confirmar el pago en /pagos/simular).',
  })
  @ApiCreatedResponse({ description: 'Membresía contratada' })
  @ApiNotFoundResponse({ description: 'Plan no encontrado' })
  contratar(@Body() dto: ContratarMembresiaDto, @CurrentUser() user: JwtPayload) {
    return this.membresiasService.contratar(dto, user);
  }

  @Get(APP_ROUTES.MEMBRESIAS.MI_ESTADO)
  @ApiOperation({ summary: 'Consultar el estado de mi membresía (RF-02)' })
  @ApiOkResponse({ description: 'Estado actual de la membresía y tipo_usuario' })
  miEstado(@CurrentUser('sub') userId: number) {
    return this.membresiasService.consultarEstado(userId);
  }

  @Get(APP_ROUTES.MEMBRESIAS.BY_USUARIO)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Consultar el estado de membresía de un usuario (RF-02)' })
  @ApiOkResponse({ description: 'Estado actual de la membresía del usuario' })
  estadoPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.membresiasService.consultarEstado(usuarioId);
  }

  @Patch(APP_ROUTES.MEMBRESIAS.RENOVAR)
  @ApiOperation({
    summary: 'Renovar membresía (manual o automática simulada) (RF-02)',
    description: 'Activa o extiende la fecha de vencimiento de la membresía.',
  })
  @ApiOkResponse({ description: 'Membresía renovada en estado ACTIVO' })
  @ApiForbiddenResponse({ description: 'La membresía pertenece a otro usuario' })
  @ApiNotFoundResponse({ description: 'Membresía o plan no encontrado' })
  renovar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RenovarMembresiaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.membresiasService.renovar(id, dto, user);
  }

  @Patch(APP_ROUTES.MEMBRESIAS.SUSPENDER)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({ summary: 'Suspender una membresía (ACTIVO/VENCIDO → SUSPENDIDO) (RF-02)' })
  @ApiOkResponse({ description: 'Membresía suspendida' })
  @ApiConflictResponse({ description: 'La membresía ya está suspendida' })
  @ApiNotFoundResponse({ description: 'Membresía no encontrada' })
  suspender(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.suspender(id);
  }

  @Post(APP_ROUTES.MEMBRESIAS.PROCESAR_VENCIMIENTOS)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({
    summary: 'Disparar verificación de vencimientos (ACTIVO → VENCIDO) (RF-02)',
    description: 'Marca como VENCIDO todas las membresías activas cuya fecha_fin ya pasó.',
  })
  @ApiOkResponse({ description: 'Cantidad de membresías pasadas a VENCIDO' })
  procesarVencimientos() {
    return this.membresiasService.procesarVencimientos();
  }
}
