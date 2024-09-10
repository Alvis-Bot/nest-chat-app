import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../shared/types';

export const configSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService<AllConfigType>);

  const config = new DocumentBuilder()
    .setTitle(configService.get('app.name', { infer: true }))
    .setDescription('Description')
    .setVersion('1.0')
    .setContact(
      'Thomi Company',
      'https://thomi.com.vn/',
      'contact@thomi.com.vn',
    )
    .addBearerAuth()
    .addServer(
      `http://localhost:${configService.get('app.port', {
        infer: true,
      })}`,
      'Development',
    )
    .addServer(`https://api.example.com`, 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle:
      configService.get('app.name', { infer: true }) + ' API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
