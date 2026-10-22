import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import type { LoginDto, LoginResponseDto } from './dto/login.dto.js';

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

    const access_token = await this.jwtService.signAsync({ sub: user.id, tipo: user.tipo });
    return { access_token };
  }
}
