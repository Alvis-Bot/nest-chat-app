import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateReqDto } from './dto/user-create.req.dto';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { UserResDto } from './dto/user.res.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../common/pagination/offset/pagination.dto';
import { AuthUser } from "../../common/decorators/auth.decorator";
import { User } from "./schemas/user.schema";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiEndpoint({
    summary: 'Create a new user',
    description: 'Create a new user',
    type: UserResDto,
    isPublic: true,
  })
  @Post()
  createUser(@Body() dto: UserCreateReqDto) {
    return this.usersService.createUser(dto);
  }

  @ApiEndpoint({
    summary: 'Select users',
    description: 'Select users',
    type: UserResDto,
    isPaginated: true,
    isPublic: false,
  })
  @Get()
  selectUsers(@Query() options: PaginationDto) {
    return this.usersService.selectUsers(options);
  }

  @ApiEndpoint()
  @Get('account')
  getAccount(
    @AuthUser() user: User
  ) {
    return user;
  }
  //
  // @Get('test')
  // test() {
  //   return 'Hello World';
  // }
}
