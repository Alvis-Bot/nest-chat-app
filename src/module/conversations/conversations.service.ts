import { HttpException, Injectable } from '@nestjs/common';
import { ConversationCreateReqDto } from './dto/conversation-create-req.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { Conversation } from './schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../messages/schemas/messsage.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private readonly userService: UsersService,
  ) {}

  async createConversation(
    creator: User,
    dto: ConversationCreateReqDto,
  ): Promise<Conversation> {
    const recipient = await this.userService.findOneByUsername(dto.username);
    if (!recipient) {
      throw new HttpException('Recipient not found', 404);
    }
    if (creator._id === recipient._id) {
      throw new HttpException(
        'You cannot create a conversation with yourself',
        400,
      );
    }
    const isCreated = await this.isCreated(creator.id, recipient.id);
    if (isCreated) {
      throw new HttpException('Conversation already exists', 400);
    }

    // Create a new conversation
    // return the conversation
    const conversation = await this.conversationModel.create({
      creator: creator,
      recipient: recipient,
    });

    // new message
    await this.messageModel.create({
      author: creator,
      content: dto.message,
      conversation,
    });

    return conversation;
  }

  async isCreated(creator_id: string, recipient_id: string) {
    return this.conversationModel
      .findOne({
        $or: [
          {
            creator: creator_id,
            recipient: recipient_id,
          },
          {
            creator: recipient_id,
            recipient: creator_id,
          },
        ],
      })
      .exec();
  }

  async getConversations(_id: string) {
    return this.conversationModel
      .find({
        $or: [{ creator: _id }, { recipient: _id }],
      })
      .populate(['lastMessage', 'creator', 'recipient'])
      .sort({ updated_at: -1 })
      .exec();
  }

  async getById(_id: string) : Promise<Conversation> {
    const conversation = await this.conversationModel
      .findOne({ _id })
      .populate(['creator', 'recipient', 'lastMessage'])
      .exec();
    if (!conversation) {
      throw new HttpException('Conversation not found', 404);
    }
    return conversation;
  }

  async findById(id: string) {
    return this.conversationModel.findById(id)
      .populate(['creator', 'recipient', 'lastMessage'])
      .exec();
  }


}
