import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import { JwtPayload } from "../../../shared/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ){
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('request', request.cookies);
          return request?.cookies?.authentication?.access_token;
        }
      ])
    });
  }

  async validate(payload:JwtPayload){
    console.log('payload', payload);
    const user = await this.usersService.findOneByUsername(payload.username);
    console.log('user', user);
    if(!user){
      throw new UnauthorizedException();
    }
    return user;
  }
}