import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseModule } from './base/base.module';
import { HealthModule } from './module/health/health.module';
import appConfig from './configs/envs/app.config';
import databaseConfig from './configs/envs/database.config';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AllConfigType } from './shared/types';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { MessagesModule } from './module/messages/messages.module';
import { GatewayModule } from './module/gateway/gateway.module';
import { ConversationsModule } from './module/conversations/conversations.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './module/events/events.module';
import { FriendsModule } from './module/friends/friends.module';
import { FriendRequestsModule } from './module/friend-requests/friend-requests.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import { SessionsModule } from './module/sessions/sessions.module';
import { OneSignalModule } from "onesignal-api-client-nest";
import { FirebaseModule } from './module/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      cookieOptions: {
        name: 'fingerprint',
        httpOnly: true, // optional
      },
    }),
    OneSignalModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          appId: configService.get('ONESIGNAL_APP_ID'),
          restApiKey: configService.get('ONESIGNAL_REST_API_KEY'),
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AllConfigType>) => ({
        uri: configService.get('database.mongo_uri', { infer: true }),
        // Đồng bo schemas
      }),
      inject: [ConfigService],
    }),
    BaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    MessagesModule,
    GatewayModule,
    ConversationsModule,
    EventsModule,
    FriendsModule,
    FriendRequestsModule,
    SessionsModule,
    FirebaseModule,
  ],

})
export class AppModule {}
