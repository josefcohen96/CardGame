// src/sockets/socket-emitter.service.ts
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketEmitterService {
  private io!: Server;

  setServer(io: Server) {
    this.io = io;
  }

  emitToRoom(roomId: string, event: string, payload: any) {
    this.io.to(roomId).emit(event, payload);
  }

  emitToClient(clientId: string, event: string, payload: any) {
    this.io.to(clientId).emit(event, payload);
  }
}
