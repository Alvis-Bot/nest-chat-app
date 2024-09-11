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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AllConfigType>) => ({
        uri: configService.get('database.mongo_uri', { infer: true }),
        // Đồng bo schema
      }),
      inject: [ConfigService],
    }),
    BaseModule,
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
