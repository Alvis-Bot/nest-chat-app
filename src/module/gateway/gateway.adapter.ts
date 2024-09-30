import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { AuthenticatedSocket } from './gateway';
import cookie from 'cookie';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private redisStore: RedisStore;

  constructor(
    private readonly app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.configService.get('database.redis_url', { infer: true }),
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.redisStore = new RedisStore({
      client: pubClient,
      prefix: 'alvis:',
    });
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    server.use(async (socket: AuthenticatedSocket, next) => {
      // Do something with the socket
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const parsedCookie = cookie.parse(clientCookie);
      if (!parsedCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      console.log('Client has cookies', parsedCookie);
      const connectSid = parsedCookie['connect.sid'];
      const signedCookie = cookieParser.signedCookie(connectSid, 'secret');
      if (!signedCookie) return next(new Error('Error signing cookie'));
      // Do something with the session ID
      console.log('Signed cookie', signedCookie);
      await this.redisStore.get(signedCookie, (err, session) => {
        if (err) {
          console.log('Session not found');
          return next(new Error('Not Authenticated. Session not found'));
        }
        console.log('Session found', session);
        socket.user = session.passport.user;
        next();
      });
    });

    return server;
  }
}
