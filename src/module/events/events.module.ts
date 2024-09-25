import { Module } from '@nestjs/common';
import { MessagesEvent } from './messages.event';
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [GatewayModule],
  providers: [MessagesEvent],
  exports: [MessagesEvent],
})
export class EventsModule {}
