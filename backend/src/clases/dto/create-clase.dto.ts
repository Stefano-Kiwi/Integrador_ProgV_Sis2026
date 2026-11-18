import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateClaseDto {
  @ApiProperty({ example: 1, description: 'ID de la sede donde se dictará la clase' })
  @IsInt()
  @IsPositive()
  sede_id: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de clase (Spinning, Yoga, etc.)' })
  @IsInt()
  @IsPositive()
  tipo_clase_id: number;

  @ApiProperty({ example: 1, description: 'ID del instructor que dicta la clase' })
  @IsInt()
  @IsPositive()
  instructor_id: number;

  @ApiProperty({ example: '2026-09-29T18:00:00Z', description: 'Fecha y hora de inicio' })
  @IsDateString()
  inicio_at: string;

  @ApiProperty({ example: '2026-09-29T19:00:00Z', description: 'Fecha y hora de finalización' })
  @IsDateString()
  fin_at: string;

  @ApiProperty({ example: 20, description: 'Capacidad máxima de alumnos' })
  @IsInt()
  @IsPositive()
  capacidad_maxima: number;
}
