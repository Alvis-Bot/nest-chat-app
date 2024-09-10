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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isDevelopment = configService.get('app.env') === 'development';

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
  console.log(process.env.MONGO_URI);
  if (isDevelopment) {
    configSwagger(app);
  }

  // Middleware
  middleware(app);
  await app.listen(configService.get('app.port'));

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
