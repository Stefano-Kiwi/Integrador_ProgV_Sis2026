import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersService } from '../usuarios/users.service.js';
import bcrypt from 'bcryptjs';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUsersService = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
};

const mockJwtService = {
  signAsync: vi.fn().mockResolvedValue('mock.jwt.token'),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('debería devolver un access_token cuando las credenciales son correctas', async () => {
      const hash = await bcrypt.hash('MiClave1!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'admin@fitzone.com',
        id_rol: 3,
        sede_base_id: 1,
        password_hash: hash,
      });

      const result = await authService.login({
        email: 'admin@fitzone.com',
        password: 'MiClave1!',
      });

      expect(result).toEqual({ access_token: 'mock.jwt.token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        id_rol: 3,
        clase_rol: 'Gerente',
        sede_base_id: 1,
      });
    });

    it('debería lanzar UnauthorizedException cuando el email no existe', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noexiste@fitzone.com', password: 'cualquier' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException cuando la contraseña es incorrecta', async () => {
      const hash = await bcrypt.hash('ContraseñaReal1!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'admin@fitzone.com',
        id_rol: 3,
        password_hash: hash,
      });

      await expect(
        authService.login({ email: 'admin@fitzone.com', password: 'ContraseñaMAL' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('no debería revelar si el email existe (mismo error en ambos casos)', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const errorSinUser = await authService.login({
        email: 'x@x.com', password: 'pass',
      }).catch((e: UnauthorizedException) => e.message);

      const hash = await bcrypt.hash('real', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1, email: 'x@x.com', id_rol: 1, password_hash: hash,
      });
      const errorMalPass = await authService.login({
        email: 'x@x.com', password: 'wrong',
      }).catch((e: UnauthorizedException) => e.message);

      expect(errorSinUser).toBe(errorMalPass);
    });
  });

  describe('me()', () => {
    it('debería devolver el perfil del usuario cuando existe', async () => {
      const user = { id: 1, email: 'admin@fitzone.com', nombre: 'Admin' };
      mockUsersService.findById.mockResolvedValue(user);

      const res = await authService.me(1);
      expect(res).toEqual(user);
    });

    it('debería lanzar NotFoundException cuando el usuario no existe', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(authService.me(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verify()', () => {
    it('debería autorizar cuando el rol coincide', () => {
      const res = authService.verify(1, 3, { roles: ['Gerente', 'Administrador'] });
      expect(res).toEqual({
        autorizado: true,
        rol_usuario: 'Gerente',
        roles_requeridos: ['Gerente', 'Administrador'],
      });
    });

    it('debería rechazar con ForbiddenException cuando el rol no coincide', () => {
      expect(() =>
        authService.verify(1, 1, { roles: ['Gerente', 'Administrador'] }),
      ).toThrow(ForbiddenException);
    });
  });
});

