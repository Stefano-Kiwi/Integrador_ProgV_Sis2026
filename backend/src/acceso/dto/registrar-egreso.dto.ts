import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class RegistrarEgresoDto {
  @ApiPropertyOptional({
    example: 3,
    description: 'ID del socio que egresa (si se omite, se usa el usuario autenticado)',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;
}
