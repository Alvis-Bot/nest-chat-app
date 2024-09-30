import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagesCreateResponse } from '../../shared/types';
import { MessagingGateway } from '../gateway/gateway';
import { GatewaySessionManager } from '../gateway/gateway.session';

@Injectable()
export class MessagesEvent {
  constructor(
    private readonly sessions: GatewaySessionManager,
    private readonly gateway: MessagingGateway,
  ) {}

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: MessagesCreateResponse) {
    console.log('Inside message.create');
    const {
      author,
      conversation: { creator, recipient },
    } = payload.message;

    //Author is the user who sent the message
    const authorSocket = this.sessions.getUserSocket(author._id.toString());
    //Recipient is the user who received the message
    const recipientSocket = !author._id.equals(creator._id)
      ? this.sessions.getUserSocket(recipient._id.toString())
      : this.sessions.getUserSocket(creator._id.toString());


    if (authorSocket) recipientSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }
}
