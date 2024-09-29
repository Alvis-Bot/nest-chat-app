import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { LoginResDto } from './dto/login.res.dto';
import { UsersService } from '../users/users.service';
import { RegisterResDto } from './dto/register.res.dto';
import { Request, Response } from 'express';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { AuthUser } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../../shared/types';
import { User } from "../users/schemas/user.schema";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(
    @AuthUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Fingerprint() fp: IFingerprint,
    @Body() dto: LoginResDto,
  ) {
    const authentication = await this.authService.getJwtToken(user , fp , dto.fcmToken);
    res.cookie('authentication', authentication, {
      httpOnly: true,
      secure: false,
    });
  }

  @Post('register')
  signUp(@Body() dto: RegisterResDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  getHello(@Req() req: Request) {
    return req.user;
  }

  @ApiEndpoint({
    isPublic: true,
  })
  @Post('random')
  random() {
    return this.usersService.random();
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refresh(
    @AuthUser() payload: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('payload', payload);
    const authentication = await this.authService.refreshTokens(
      payload.username,
      payload.refresh_token,
    );
    // uodate the cookie
    res.cookie('authentication', authentication, {
      httpOnly: true,
      secure: false,
    });
  }

  //Get / logout
  @Get('/logout')
  logout(@Req() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
