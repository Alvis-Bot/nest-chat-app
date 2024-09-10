import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { middleware } from './app.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware
  middleware(app);
  await app.listen(3000);
}

bootstrap();
