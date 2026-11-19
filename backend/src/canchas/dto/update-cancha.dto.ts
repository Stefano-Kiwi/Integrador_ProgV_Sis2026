import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class UpdateCanchaDto {
  @ApiPropertyOptional({ example: 'Cancha 1 (Paddle)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sede_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tipo_cancha_id?: number;

  @ApiPropertyOptional({ example: 9500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_hora?: number;
}
