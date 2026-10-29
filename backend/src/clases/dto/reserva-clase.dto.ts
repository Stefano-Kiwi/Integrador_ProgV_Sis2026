import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class ReservaClaseDto {
  @ApiProperty({ example: 1, description: 'ID de la clase a reservar' })
  @IsInt()
  @IsPositive()
  clase_id: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que realiza la reserva' })
  @IsInt()
  @IsPositive()
  usuario_id: number;
}
