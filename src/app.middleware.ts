import { INestApplication } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './shared/types';
import RedisStore from 'connect-redis';
import { RedisIoAdapter } from './module/gateway/gateway.adapter';
import { createClient } from 'redis';

export  async function middleware(
  app: INestApplication,
): Promise<INestApplication> {
  // Compression middleware
  app.use(compression());

  const configService = app.get(ConfigService<AllConfigType>);

  // Helmet for security headers with environment-specific configurations
  const isProd = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false, // Disable CSP for development
    }),
  );

  // CORS setup
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Reuse Redis client if already connected
  const redisClient = createClient({
    url : configService.get('database.redis_url', { infer: true }),
  });
  redisClient.connect().catch(console.error)
  const RedisStoreInstance = new RedisStore({
    client: redisClient,
    prefix: 'alvis:',
  });
  const redisIoAdapter = new RedisIoAdapter(app , configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Session middleware
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProd, // Use secure cookies in production (HTTPS only)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
      },
      store: RedisStoreInstance,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Cookie parser middleware
  app.use(cookieParser());

  return app;
}
