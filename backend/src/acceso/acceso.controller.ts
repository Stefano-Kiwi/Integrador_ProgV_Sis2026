import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccesoService } from './acceso.service.js';
import { ValidarAccesoDto } from './dto/validar-acceso.dto.js';
import { RegistrarEgresoDto } from './dto/registrar-egreso.dto.js';
import { SincronizarAccesosDto } from './dto/sincronizar-accesos.dto.js';
import { APP_ROUTES } from '../routes/index.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('acceso')
@ApiBearerAuth('access-token')
@Controller(APP_ROUTES.ACCESO.ROOT)
export class AccesoController {
  constructor(private readonly accesoService: AccesoService) {}

  @Get(APP_ROUTES.ACCESO.QR)
  @ApiOperation({
    summary: 'Obtener QR dinámico rotativo del socio autenticado (RF-04)',
    description:
      'Emite un token firmado con HMAC-SHA256 válido por 60 segundos que rota cada minuto. Requiere membresía ACTIVA.',
  })
  @ApiOkResponse({ description: 'Token QR y ventana de validez de 60 segundos' })
  @ApiForbiddenResponse({ description: 'Membresía inactiva, vencida o suspendida' })
  generarQr(@CurrentUser('sub') userId: number) {
    return this.accesoService.generarQr(userId);
  }

  @Post(APP_ROUTES.ACCESO.VALIDAR)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({
    summary: 'Validar QR y registrar ingreso en sede (RF-03, RF-04, RN-01)',
    description:
      'Verifica firma HMAC, vigencia de 60 s, membresía ACTIVA (acceso multi-sede) y registra el ingreso. ' +
      'Rechaza con 409 si el socio ya tiene un ingreso activo en otra sede.',
  })
  @ApiOkResponse({ description: 'Ingreso autorizado y registrado' })
  @ApiUnauthorizedResponse({ description: 'QR con firma inválida o vencido' })
  @ApiForbiddenResponse({ description: 'Socio en mora o sin membresía activa' })
  @ApiConflictResponse({ description: 'El socio ya está dentro de otra sede (RN-01)' })
  validar(@Body() dto: ValidarAccesoDto) {
    return this.accesoService.validarIngreso(dto);
  }

  @Post(APP_ROUTES.ACCESO.EGRESO)
  @ApiOperation({
    summary: 'Registrar salida (egreso) de un socio',
    description: 'Cierra el acceso abierto (egreso_at) del socio indicado o del usuario autenticado.',
  })
  @ApiOkResponse({ description: 'Egreso registrado correctamente' })
  @ApiNotFoundResponse({ description: 'El socio no tiene un ingreso activo' })
  egreso(@Body() dto: RegistrarEgresoDto, @CurrentUser('sub') currentUserId: number) {
    return this.accesoService.registrarEgreso(dto.userId ?? currentUserId);
  }

  @Get(APP_ROUTES.ACCESO.AFORO)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({
    summary: 'Consultar aforo actual y máximo permitido por sede (RF-05)',
  })
  @ApiOkResponse({ description: 'Ocupación actual y aforo máximo de la sede' })
  @ApiNotFoundResponse({ description: 'Sede no encontrada' })
  aforo(@Param('sedeId', ParseIntPipe) sedeId: number) {
    return this.accesoService.obtenerAforo(sedeId);
  }

  @Post(APP_ROUTES.ACCESO.SINCRONIZAR)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({
    summary: 'Sincronizar lote de ingresos validados offline (RNF-01)',
    description:
      'Registra de forma idempotente los ingresos capturados offline por el terminal de sede y reporta aceptados y conflictos.',
  })
  @ApiOkResponse({ description: 'Resumen de ingresos aceptados y conflictos detectados' })
  sincronizar(@Body() dto: SincronizarAccesosDto) {
    return this.accesoService.sincronizarOffline(dto);
  }

  @Get(APP_ROUTES.ACCESO.SNAPSHOT)
  @Roles('Gerente', 'Administrador')
  @ApiOperation({
    summary: 'Obtener snapshot local de socios activos para validación offline (RNF-01)',
  })
  @ApiOkResponse({ description: 'Copia local de socios activos de la red para el terminal de sede' })
  @ApiNotFoundResponse({ description: 'Sede no encontrada' })
  snapshot(@Param('sedeId', ParseIntPipe) sedeId: number) {
    return this.accesoService.obtenerSnapshotSede(sedeId);
  }
}
