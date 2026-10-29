import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsPositive, Max, Min } from 'class-validator';

export class ReservaCanchaDto {
  @ApiProperty({ example: 1, description: 'ID de la cancha a reservar' })
  @IsInt()
  @IsPositive()
  cancha_id: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que realiza la reserva' })
  @IsInt()
  @IsPositive()
  usuario_id: number;

  @ApiProperty({ example: '2026-10-30', description: 'Fecha de reserva (YYYY-MM-DD)' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: 18, description: 'Hora de inicio (0 a 23)' })
  @IsInt()
  @Min(0)
  @Max(23)
  hora_inicio: number;
}
