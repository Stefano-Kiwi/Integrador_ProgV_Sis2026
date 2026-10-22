import { Injectable } from '@nestjs/common';
import type { usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { TipoUsuario } from './dto/create-user.dto.js';

/** Datos ya listos para insertar (la contraseña llega YA hasheada). */
export interface NewUserData {
  tipo: TipoUsuario;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  passwordHash: string;
}

/** Usuario sin el hash: es lo único que sale de esta capa hacia afuera en `create`. */
export const PUBLIC_USER_SELECT = {
  id: true,
  tipo: true,
  dni: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  foto_url: true,
  fecha_alta: true,
} as const;

export type PublicUser = Omit<usuario, 'password_hash'>;

/** Repository: único lugar que accede a la tabla `usuario` vía Prisma. */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Incluye password_hash: solo para que Auth pueda comparar. No exponer. */
  findByEmail(email: string): Promise<usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  findById(id: number): Promise<PublicUser | null> {
    return this.prisma.usuario.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
  }

  /**
   * Crea el usuario y, en la misma operación (transacción), su fila en
   * `socio` o `cliente_externo` según el tipo. Devuelve el usuario sin hash.
   */
  create(data: NewUserData): Promise<PublicUser> {
    const { passwordHash, tipo, ...rest } = data;
    return this.prisma.usuario.create({
      data: {
        ...rest,
        tipo,
        password_hash: passwordHash,
        ...(tipo === 'SOCIO' ? { socio: { create: {} } } : { cliente_externo: { create: {} } }),
      },
      select: PUBLIC_USER_SELECT,
    });
  }
}
