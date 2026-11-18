import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ana@fitzone.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'MiClaveSegura1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT para usar como Bearer token', example: 'eyJhbGciOi...' })
  access_token: string;
}
