import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewaySessionManager } from './gateway.session';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessions: GatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userId as string;
    console.log('Client connected', client.id, userId);
    if (!userId) {
      client.disconnect();
      return;
    }
    console.log('Client connected', client.id);
    this.sessions.setUserSocket(userId, client);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log('Client disconnected', client.id);
    this.sessions.removeUserSocket(userId);
  }
}
