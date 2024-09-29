import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../../shared/types';
import { hashData } from '../../shared/utils/utils';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { SessionsService } from "../sessions/sessions.service";
import { IFingerprint } from "nestjs-fingerprint";
import { User } from "../users/schemas/user.schema";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionsService: SessionsService,
  ) {}

  async getJwtToken(
    user: User,
    fp: IFingerprint,
    fcmToken?: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      username: user['username'],
      sub: user._id.toString(),
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);
    const hashedRefreshToken = await hashData(refresh_token);
    await this.usersService.updateRefreshToken(user._id, hashedRefreshToken);
    //update session
    await this.sessionsService.updateSession(user._id, fp ,fcmToken);
    return { access_token, refresh_token };
  }

  async getAccessToken(user: Express.User) {
    const payload: JwtPayload = {
      username: user['username'],
      sub: user['_id'],
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
  }


  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log('user', user);
    const passwordValid = user?.password === password;
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async refreshTokens(
    username: string,
    refreshToken: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    const isValid = await argon2.verify(user.refresh_token, refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const access_token = await this.getAccessToken(user);
    return { access_token, refresh_token: refreshToken };
  }
}
