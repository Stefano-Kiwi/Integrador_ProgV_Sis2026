import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupSwagger } from './swagger/swagger.setup.js';

async function bootstrap() {
  try {
    process.loadEnvFile(); // carga backend/.env (Node 20+)
  } catch {
    // sin .env: se usan las variables del entorno
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


