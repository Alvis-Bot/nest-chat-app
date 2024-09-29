import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ConversationsService } from './conversations.service';
import { ConversationCreateReqDto } from './dto/conversation-create-req.dto';
import { User } from '../users/schemas/user.schema';
import { AuthUser } from '../../common/decorators/auth.decorator';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @ApiEndpoint({
    isPublic: false,
  })
  @Post()
  createConversation(
    @AuthUser() user: User,
    @Body() dto: ConversationCreateReqDto,
  ) {
    console.log('user', user);
    return this.conversationsService.createConversation(user, dto);
  }

  @ApiEndpoint({
    isPublic: false,
  })
  @Get()
  getConversations(@AuthUser() { _id }: User) {
    return this.conversationsService.getConversations(_id);
  }

  @ApiEndpoint({
    isPublic: false,
  })
  @Get(':id')
  getConversation(@Param('id') _id: string) {
    return this.conversationsService.getById(_id);
  }

}
