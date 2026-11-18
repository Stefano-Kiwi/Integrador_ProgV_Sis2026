import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, LoginResponseDto } from './dto/login.dto.js';
import { MeResponseDto, VerifyRolDto, VerifyResponseDto } from './dto/verify.dto.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser, type JwtPayload } from './decorators/current-user.decorator.js';
import { APP_ROUTES } from '../routes/index.js';

@ApiTags('auth')
@Controller(APP_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── POST /auth/login ────────────────────────────────────────────────────────

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

  // ── GET /auth/me ────────────────────────────────────────────────────────────

  @Get(APP_ROUTES.AUTH.ME)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Perfil del usuario autenticado',
    description: 'Devuelve los datos del usuario identificado por el JWT, incluyendo su rol.',
  })
  @ApiOkResponse({ description: 'Datos del usuario autenticado', type: MeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  me(@CurrentUser() user: JwtPayload): Promise<MeResponseDto> {
    return this.authService.me(user.sub);
  }

  // ── POST /auth/verify ───────────────────────────────────────────────────────

  @Post(APP_ROUTES.AUTH.VERIFY)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Verificar si el usuario tiene permiso para acceder a una página',
    description:
      'El frontend envía los roles requeridos para una página. ' +
      'Devuelve 200 si el usuario tiene uno de esos roles, 403 si no. ' +
      'Siempre requiere un JWT válido (401 si no se envía).',
  })
  @ApiBody({ type: VerifyRolDto })
  @ApiOkResponse({ description: 'El usuario tiene permiso', type: VerifyResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @ApiForbiddenResponse({ description: 'El usuario no tiene el rol requerido' })
  verify(
    @CurrentUser() user: JwtPayload,
    @Body() dto: VerifyRolDto,
  ): VerifyResponseDto {
    return this.authService.verify(user.sub, user.id_rol, dto);
  }
}

