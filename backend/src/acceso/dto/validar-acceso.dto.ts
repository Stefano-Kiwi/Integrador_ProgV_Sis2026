import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ValidarAccesoDto {
  @ApiProperty({ description: 'Token QR dinámico emitido por GET /acceso/qr' })
  @IsString()
  @IsNotEmpty()
  qr: string;

  @ApiProperty({ example: 1, description: 'ID de la sede donde se intenta ingresar' })
  @IsInt()
  @IsPositive()
  sedeId: number;
}
