import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateClaseDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sede_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tipo_clase_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  instructor_id?: number;

  @ApiPropertyOptional({ example: '2026-12-01T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  inicio_at?: string;

  @ApiPropertyOptional({ example: '2026-12-01T19:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fin_at?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  capacidad_maxima?: number;
}
