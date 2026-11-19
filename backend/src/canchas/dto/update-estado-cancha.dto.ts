import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const ESTADOS_CANCHA = ['HABILITADA', 'EN_MANTENIMIENTO'] as const;
export type EstadoCanchaValor = (typeof ESTADOS_CANCHA)[number];

export class UpdateEstadoCanchaDto {
  @ApiProperty({
    enum: ESTADOS_CANCHA,
    example: 'EN_MANTENIMIENTO',
    description: 'Nuevo estado. EN_MANTENIMIENTO bloquea reservas futuras sin afectar las ya confirmadas.',
  })
  @IsIn(ESTADOS_CANCHA)
  estado: EstadoCanchaValor;
}
