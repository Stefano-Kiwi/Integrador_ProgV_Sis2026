import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('FitZone Sports API')
    .setDescription('Documentación de la API de FitZone Sports')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addSecurityRequirements('access-token') // Sends token on ALL endpoints by default
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'FitZone Sports API Docs',
    jsonDocumentUrl: 'api/swagger.json',
    yamlDocumentUrl: 'api/swagger.yaml',
  };

  const document = SwaggerModule.createDocument(app, config);

  // Guarda automáticamente una copia del swagger.json en el proyecto al iniciar
  try {
    writeFileSync('./swagger.json', JSON.stringify(document, null, 2), 'utf-8');
  } catch (error) {
    console.warn('No se pudo exportar swagger.json a disco:', error);
  }

  SwaggerModule.setup('api', app, () => document, customOptions);
}
