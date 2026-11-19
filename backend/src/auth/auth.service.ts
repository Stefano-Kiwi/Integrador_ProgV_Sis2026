import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../usuarios/users.service.js';
import type { LoginDto, LoginResponseDto } from './dto/login.dto.js';
import type { VerifyRolDto, VerifyResponseDto, MeResponseDto } from './dto/verify.dto.js';
import type { AppRole } from '../common/decorators/roles.decorator.js';

/** Mapa id_rol → nombre de rol (igual que en roles.guard.ts) */
const ROLE_NAME_MAP: Record<number, AppRole> = {
  1: 'Cliente',
  2: 'Instructor',
  3: 'Gerente',
  4: 'Administrador',
};

/**
 * Hash válido de una clave cualquiera. Se compara contra él cuando el email no existe,
 * para que la respuesta tarde lo mismo y no se pueda adivinar qué emails están registrados.
 */
const DUMMY_HASH = bcrypt.hashSync('contraseña-inexistente', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(email);
    const passwordOk = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

    if (!user || !passwordOk) {
      // Mismo mensaje en ambos casos: no revelamos si el email existe.
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id, id_rol: user.id_rol });
    return { access_token };
  }

  /**
   * Devuelve el perfil completo del usuario identificado por el JWT.
   * El JwtAuthGuard ya validó el token; aquí solo buscamos el usuario en DB.
   */
  async me(userId: number): Promise<MeResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user as MeResponseDto;
  }

  /**
   * Verifica si el usuario autenticado tiene uno de los roles requeridos.
   * - 200: el usuario tiene permiso
   * - 403: el usuario está autenticado pero no tiene el rol necesario
   */
  verify(userId: number, userRolId: number, dto: VerifyRolDto): VerifyResponseDto {
    const rolUsuario = ROLE_NAME_MAP[userRolId] ?? 'Desconocido';
    const autorizado = dto.roles.includes(rolUsuario as AppRole);

    if (!autorizado) {
      throw new ForbiddenException({
        autorizado: false,
        rol_usuario: rolUsuario,
        roles_requeridos: dto.roles,
        mensaje: `Acceso denegado. Tu rol (${rolUsuario}) no tiene permiso para esta página.`,
      });
    }

    return {
      autorizado: true,
      rol_usuario: rolUsuario,
      roles_requeridos: dto.roles,
    };
  }
}

