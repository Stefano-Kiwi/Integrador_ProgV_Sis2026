import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateSedeDto {
  @ApiProperty({ example: 'FitZone Concordia Centro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  direccion: string;

  @ApiProperty({ example: 'Concordia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  localidad: string;

  @ApiProperty({ example: 80, description: 'Capacidad de aforo máximo permitido' })
  @IsInt()
  @IsPositive()
  aforo_maximo: number;
}
