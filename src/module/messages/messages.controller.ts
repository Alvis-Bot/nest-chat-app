import {
  Body,
  Controller, Get, HttpException, Param,
  Post, Query,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MessageCreateDto } from "./dto/message-create.dto";
import { MessagesService } from "./messages.service";
import { AuthUser } from "../../common/decorators/auth.decorator";
import { User } from "../users/schemas/user.schema";
import { ApiEndpoint } from "../../common/decorators/http.decorator";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller('messages')
export class MessagesController {


  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     {
  //       name: 'attachments',
  //       maxCount: 5,
  //     },
  //   ]),
  // )
  @ApiEndpoint({
    isPublic: false,
  })
  @Post(':conversationId')
  async createMessage(
    @AuthUser() user: User,
    // @UploadedFiles() { attachments }: { attachments: Express.Multer.File[] },
    @Param('conversationId') conversationId: string,
    @Body() { content }: MessageCreateDto,
  ) {
    if (!content) throw new HttpException('No content', 400);
    // save message
    console.log('create message', conversationId);
    const response = await this.messagesService.createMessage(conversationId, content , user);
    this.eventEmitter.emit('message.create', response);
  }

  @ApiEndpoint({
    isPublic: false,
  })
  @Get('')
  getMessagesFromConversation(
    @AuthUser() user: User,
    @Query('conversation_id') conversation_id: string,
  ) {
    return this.messagesService.getMessages(conversation_id);
  }

}
