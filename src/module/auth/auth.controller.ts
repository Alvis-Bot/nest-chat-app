import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { LoginResDto } from './dto/login.res.dto';
import { UsersService } from "../users/users.service";
import { RegisterResDto } from "./dto/register.res.dto";
import { AuthUser } from "../../common/decorators/auth.decorator";
import { User } from "../users/schemas/user.schema";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiEndpoint({
    isPublic: true,
  })
  @Post('login')
  signIn(
    @Body() dto: LoginResDto) {
    return this.authService.signIn(dto.username, dto.password);
  }


  @ApiEndpoint({
    isPublic: true,
  })
  @Post('register')
  signUp(@Body() dto: RegisterResDto) {
    return this.usersService.create(dto);
  }
}
