import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { usuario } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersRepository, type PublicUser } from './users.repository.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';

/** Costo del hash: más alto = más seguro pero más lento. 10 es el estándar. */
const SALT_ROUNDS = 10;
const ID_ROLES_PERSONAL = [3, 4]; // Gerente, Administrador

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** RF-01: distingue Socio (posee membresía) de Cliente Externo (sin membresía). */
  private withTipoUsuario(user: PublicUser): PublicUser {
    return {
      ...user,
      tipo_usuario:
        user.membresia && user.membresia.length > 0 ? 'SOCIO' : 'CLIENTE_EXTERNO',
    };
  }

  /** Hashea la contraseña y crea el usuario. Devuelve el usuario SIN hash. */
  async create(dto: CreateUserDto): Promise<PublicUser> {
    const { password, email, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    try {
      const created = await this.usersRepository.create({
        ...rest,
        email: email.toLowerCase(),
        passwordHash,
      });
      return this.withTipoUsuario(created);
    } catch (error) {
      // P2002 = violación de unique (email o dni ya existen)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El email o el DNI ya están registrados');
      }
      throw error;
    }
  }

  /** RF-01: actualiza los datos del perfil del usuario (propio o mediante personal). */
  async update(id: number, dto: UpdateUserDto, currentUser: JwtPayload): Promise<PublicUser> {
    const esPersonal = ID_ROLES_PERSONAL.includes(currentUser.id_rol);
    if (id !== currentUser.sub && !esPersonal) {
      throw new ForbiddenException('Solo podés modificar tu propio perfil');
    }

    const existente = await this.usersRepository.findById(id);
    if (!existente) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const payload: UpdateUserDto = {
      ...dto,
      ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
    };

    try {
      const updated = await this.usersRepository.update(id, payload);
      return this.withTipoUsuario(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El email ya se encuentra registrado');
      }
      throw error;
    }
  }

  /** Uso interno de Auth: devuelve el registro con hash. Nunca devolver al cliente. */
  findByEmail(email: string): Promise<usuario | null> {
    return this.usersRepository.findByEmail(email.toLowerCase());
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map((u) => this.withTipoUsuario(u));
  }

  async findById(id: number): Promise<PublicUser | null> {
    const user = await this.usersRepository.findById(id);
    return user ? this.withTipoUsuario(user) : null;
  }
}
