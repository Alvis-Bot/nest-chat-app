import { HttpException, Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { Message } from './schemas/messsage.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Conversation } from '../conversations/schemas/conversation.schema';
import { compareObjectId } from "../../shared/utils/utils";
import { MessagesCreateResponse } from "../../shared/types";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private conversationsService: ConversationsService,
  ) {}

  async createMessage(
    conversationId: string,
    content: string,
    // files: Express.Multer.File[],
    user: User,
  ): Promise<MessagesCreateResponse> {
    const conversation =
      await this.conversationsService.getById(conversationId);
    const { creator, recipient } = conversation;

    // console.log(conversation);
    // const isFriends = await this.friendsService.isFriends(
    //   creator.id,
    //   recipient.id,
    // );
    // if (!isFriends) throw new FriendNotFoundException();


    console.log(conversation);
    console.log(recipient._id.equals(user._id));
    if (creator._id.equals(user._id) && recipient._id.equals(user._id)) {
      throw new HttpException(
        'You are not a participant of this conversation',
        403,
      );
    }

    const message = await this.messageModel.create({
      conversation,
      content,
      author: user,
    });
    const updatedConversation = await this.conversationsService.findById(conversationId);
    return { message, conversation : updatedConversation };
  }

  async getMessages(conversation_id: string) :Promise<Message[]> {
    return this.messageModel
      .find({ conversation: conversation_id })
      .populate('author')
      .sort({ created_at: 1 })
      .exec();
  }
}
