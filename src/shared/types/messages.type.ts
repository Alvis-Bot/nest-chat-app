import { Conversation } from '../../module/conversations/schemas/conversation.schema';
import { Message } from '../../module/messages/schemas/messsage.schema';

export type MessagesCreateResponse = {
  conversation: Conversation;
  message: Message;
};
