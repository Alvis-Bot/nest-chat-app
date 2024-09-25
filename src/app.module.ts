import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseModule } from './base/base.module';
import { HealthModule } from './health/health.module';
import appConfig from './configs/envs/app.config';
import databaseConfig from './configs/envs/database.config';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AllConfigType } from './shared/types';
import { UsersModule } from './module/users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './module/auth/auth.module';
import { MessagesModule } from './module/messages/messages.module';
import { GatewayModule } from './module/gateway/gateway.module';
import { ConversationsModule } from './module/conversations/conversations.module';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventsModule } from './module/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
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
    FirebaseModule,
    AuthModule,
    MessagesModule,
    GatewayModule,
    ConversationsModule,
    EventsModule,
  ],
})
export class AppModule {}
