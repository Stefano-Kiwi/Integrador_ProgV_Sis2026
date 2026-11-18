import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Mensual' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 1, description: 'Duración en meses' })
  @IsInt()
  @IsPositive()
  duracion_meses: number;

  @ApiProperty({ example: 15000, description: 'Precio del plan' })
  @IsNumber()
  @IsPositive()
  precio: number;
}
