import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../../shared/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    console.log(user);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token:  await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
