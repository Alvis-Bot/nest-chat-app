import { Injectable } from "@nestjs/common";

import {  Socket} from 'socket.io';



@Injectable()
export class GatewaySessionManager {
  private readonly sessions: Map<string, Socket> = new Map();

  getUserSocket(userId: string) {
    return this.sessions.get(userId);
  }

  setUserSocket(userId: string, socket: Socket) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: string) {
    this.sessions.delete(userId);
  }
  getSockets(): Map<string, Socket> {
    return this.sessions;
  }
}