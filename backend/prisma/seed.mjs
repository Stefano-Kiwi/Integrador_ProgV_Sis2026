// Seed de usuarios de prueba con contraseña hasheada de verdad (bcrypt).
// Uso: npm run seed
// Es idempotente: si el email ya existe, lo deja como está (upsert con update vacío).
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

try {
  process.loadEnvFile(); // carga backend/.env
} catch {
  // sin .env: se usan las variables del entorno
}

const prisma = new PrismaClient();

const usuarios = [
  { tipo: 'SOCIO', dni: '90000001', nombre: 'Socio', apellido: 'Demo', email: 'socio.demo@fitzone.com', password: 'Demo1234!' },
  { tipo: 'CLIENTE_EXTERNO', dni: '90000002', nombre: 'Cliente', apellido: 'Demo', email: 'cliente.demo@fitzone.com', password: 'Demo1234!' },
];

try {
  for (const { password, tipo, ...datos } of usuarios) {
    const password_hash = await bcrypt.hash(password, 10);
    await prisma.usuario.upsert({
      where: { email: datos.email },
      update: {},
      create: {
        ...datos,
        tipo,
        password_hash,
        ...(tipo === 'SOCIO' ? { socio: { create: {} } } : { cliente_externo: { create: {} } }),
      },
    });
    console.log(`OK: ${datos.email} (${tipo})`);
  }
} finally {
  await prisma.$disconnect();
}
