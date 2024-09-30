import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { middleware } from './app.middleware';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from './configs/swagger.config';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { AllConfigType } from './shared/types';
import { Environment } from './shared/constants/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AllConfigType>);
  const isDevelopment =
    configService.get('app.node_env', { infer: true }) ===
    Environment.DEVELOPMENT;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // transform payload to DTO instance
      whitelist: true, // strip out non-whitelisted properties
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  // setup global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(configService));

  if (isDevelopment) {
    configSwagger(app);
  }

  // Middleware
   await middleware(app);
  await app.listen(configService.get('app.port', { infer: true }));

  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
