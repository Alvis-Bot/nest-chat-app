import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
