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

    const authorSocket = this.sessions.getUserSocket(author.id);
    const recipientSocket =
      author._id === creator._id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);

    console.log('authorSocket', authorSocket);
    console.log('recipientSocket', recipientSocket.id);
    if (authorSocket) recipientSocket.emit('onMessage', payload.conversation);
    if (recipientSocket) recipientSocket.emit('onMessage', payload.conversation);
  }
}
