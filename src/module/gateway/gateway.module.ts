import { Module } from '@nestjs/common';
import { GatewaySessionManager } from './gateway.session';
import { MessagingGateway } from './gateway';
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [JwtModule, GatewaySessionManager, MessagingGateway],
  exports: [GatewaySessionManager, MessagingGateway],
})
export class GatewayModule {}
