import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewaySessionManager } from './gateway.session';
import { JwtService } from '@nestjs/jwt';
import { User } from "../users/schemas/user.schema";

export interface AuthenticatedSocket extends Socket {
  user: User;
}

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
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

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    console.log('Client connected:', client.id , client.user._id);
    this.sessions.setUserSocket(client.user._id.toString(), client);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.sessions.removeUserSocket(client.user._id.toString());
  }
}
