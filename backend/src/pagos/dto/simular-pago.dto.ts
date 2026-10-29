import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsPositive } from 'class-validator';

export const ORIGEN_PAGO_TIPOS = ['membresia', 'cancha'] as const;
export type OrigenPagoTipo = (typeof ORIGEN_PAGO_TIPOS)[number];

export class SimularPagoDto {
  @ApiProperty({ enum: ORIGEN_PAGO_TIPOS, example: 'cancha', description: 'Origen del pago: membresia o cancha' })
  @IsIn(ORIGEN_PAGO_TIPOS)
  origen_tipo: OrigenPagoTipo;

  @ApiProperty({ example: 1, description: 'ID de la reserva de cancha o membresía' })
  @IsInt()
  @IsPositive()
  origen_id: number;

  @ApiProperty({ example: 8000, description: 'Monto a pagar' })
  @IsNumber()
  @IsPositive()
  monto: number;
}
