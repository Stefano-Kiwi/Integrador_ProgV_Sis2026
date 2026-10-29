import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, LoginResponseDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';
import { APP_ROUTES } from '../routes/index.js';

@ApiTags('auth')
@Controller(APP_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(APP_ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Credenciales correctas: devuelve el JWT', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Body inválido (email mal formado, campos faltantes)' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas (mensaje genérico)' })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
