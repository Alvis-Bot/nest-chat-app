import {
  Body,
  Controller,
  Get, Patch,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { UsersService } from '../users/users.service';
import { RegisterResDto } from './dto/register.res.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthUser } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../../shared/types';
import { User } from '../users/schemas/user.schema';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { SessionsService } from '../sessions/sessions.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@AuthUser() user: User) {
    return user;
  }

  @Post('register')
  signUp(@Body() dto: RegisterResDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(AuthenticatedGuard)
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

  @ApiEndpoint()
  @Post('getAllSessionsByUser')
  getAllSessionsByUser(@AuthUser() user: User) {
    console.log('getAllSessionsByUser', user);
    return this.sessionsService.getAllSessionsByUser(user._id);
  }

  @Patch('renew')
  async renew(@Req() req: Request, @Res() res: Response) {
    const session = await this.sessionsService.findOneBySignedCookie(req.cookies['connect.sid']);
    if (!session) {
      return res.status(401).json({ msg: 'Session not found' });
    }
    session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await session.save();
    return res.json({ msg: 'Session renewed' });
  }



  //Get / logout
  @Get('/logout')
  logout(@Req() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
