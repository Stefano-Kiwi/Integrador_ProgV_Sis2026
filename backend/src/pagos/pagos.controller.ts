import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SimularPagoDto } from './dto/simular-pago.dto.js';
import { PagosService } from './pagos.service.js';
import { APP_ROUTES } from '../routes/index.js';

@ApiTags('pagos')
@Controller(APP_ROUTES.PAGOS.ROOT)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos registrados' })
  @ApiOkResponse({ description: 'Listado de pagos y sus comprobantes' })
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(APP_ROUTES.PAGOS.BY_ID)
  @ApiOperation({ summary: 'Obtener detalle de un pago por ID' })
  @ApiOkResponse({ description: 'Detalle del pago y comprobante' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findById(id);
  }

  @Post(APP_ROUTES.PAGOS.SIMULAR)
  @ApiOperation({ summary: 'Simular y registrar procesamiento de pago', description: 'Procesa el pago de una cancha o membresía y genera el comprobante' })
  @ApiCreatedResponse({ description: 'Pago aprobado y comprobante emitido' })
  simularPago(@Body() dto: SimularPagoDto) {
    return this.pagosService.simularPago(dto);
  }
}
