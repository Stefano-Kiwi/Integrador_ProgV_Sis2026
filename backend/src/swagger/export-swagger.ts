// Exporta el contrato OpenAPI a backend/swagger.json.
// Uso: npm run swagger:export  (compila y ejecuta este script; no necesita base de datos).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module.js';
import { buildSwaggerConfig } from './swagger.setup.js';

async function exportSwagger() {
  // preview: true => Nest arma las rutas/metadata sin instanciar providers (no conecta a PostgreSQL)
  const app = await NestFactory.create(AppModule, { preview: true, logger: false });
  const document = SwaggerModule.createDocument(app, buildSwaggerConfig());

  const destino = resolve(process.cwd(), 'swagger.json');
  writeFileSync(destino, JSON.stringify(document, null, 2) + '\n', 'utf-8');
  console.log(`swagger.json generado en ${destino}`);
  await app.close();
}

await exportSwagger();
