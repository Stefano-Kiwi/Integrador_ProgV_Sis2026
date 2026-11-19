import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class IngresoOfflineItemDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  sedeId: number;

  @ApiProperty({ example: '2026-11-19T14:30:00.000Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'Token QR validado offline por el terminal de sede' })
  @IsString()
  @IsNotEmpty()
  qrToken: string;
}

export class SincronizarAccesosDto {
  @ApiProperty({ type: [IngresoOfflineItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngresoOfflineItemDto)
  ingresos: IngresoOfflineItemDto[];
}
