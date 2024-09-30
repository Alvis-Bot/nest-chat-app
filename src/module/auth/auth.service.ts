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
import { IFingerprint } from "nestjs-fingerprint";
import { User } from "../users/schemas/user.schema";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}



  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    const passwordValid = user?.password === password;
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }


}
