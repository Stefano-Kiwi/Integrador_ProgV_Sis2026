import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { SimularPagoDto } from './dto/simular-pago.dto.js';
import { PagosService } from './pagos.service.js';
import { APP_ROUTES } from '../routes/index.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('pagos')
@ApiBearerAuth('access-token')
@Controller(APP_ROUTES.PAGOS.ROOT)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Roles('Administrador', 'Gerente')
  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos registrados' })
  @ApiOkResponse({ description: 'Listado de pagos y sus comprobantes' })
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(APP_ROUTES.PAGOS.COMPROBANTE)
  @Header('Content-Type', 'application/pdf')
  @ApiProduces('application/pdf')
  @ApiOperation({
    summary: 'Descargar comprobante de pago en PDF (RF-14)',
    description: 'Devuelve el archivo PDF real generado al confirmar el pago.',
  })
  @ApiOkResponse({ description: 'Archivo PDF del comprobante' })
  @ApiNotFoundResponse({ description: 'Pago o comprobante no encontrado' })
  async descargarComprobante(@Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
    const { buffer, filename } = await this.pagosService.obtenerComprobantePdf(id);
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="${filename}"`,
    });
  }

  @Get(APP_ROUTES.PAGOS.BY_ID)
  @ApiOperation({ summary: 'Obtener detalle de un pago por ID' })
  @ApiOkResponse({ description: 'Detalle del pago y comprobante' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findById(id);
  }

  @Post(APP_ROUTES.PAGOS.SIMULAR)
  @ApiOperation({
    summary: 'Simular y registrar procesamiento de pago (RF-13, RF-14, RNF-02)',
    description:
      'Procesa el pago de una cancha o membresía, guarda solo token_pasarela y genera el PDF real del comprobante.',
  })
  @ApiCreatedResponse({ description: 'Pago aprobado y comprobante PDF emitido' })
  simularPago(@Body() dto: SimularPagoDto) {
    return this.pagosService.simularPago(dto);
  }
}
