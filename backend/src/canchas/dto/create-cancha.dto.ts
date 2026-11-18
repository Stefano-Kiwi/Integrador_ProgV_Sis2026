import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateCanchaDto {
  @ApiProperty({ example: 1, description: 'ID del tipo de cancha (paddle, fútbol, etc.)' })
  @IsInt()
  @IsPositive()
  tipo_cancha_id: number;

  @ApiProperty({ example: 1, description: 'ID de la sede donde se ubica' })
  @IsInt()
  @IsPositive()
  sede_id: number;

  @ApiProperty({ example: 'Cancha 1 (Paddle)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 8000, description: 'Costo por hora de alquiler' })
  @IsNumber()
  @IsPositive()
  costo_hora: number;
}
