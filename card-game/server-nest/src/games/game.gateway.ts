import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(socket: Socket) {
    console.log(`Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Socket disconnected: ${socket.id}`);
  }

  // @SubscribeMessage('join_room')
  // async joinRoom(
  //   @MessageBody() data: { roomId: string, playerName: string },
  //   @ConnectedSocket() socket: Socket
  // ) {
  //   const state = await this.gameService.joinRoom(data.roomId, data.playerName);
  //   socket.join(data.roomId);
  //   this.server.to(data.roomId).emit('room_state', state);
  //   return state;
  // }

  // @SubscribeMessage('play_turn')
  // async playTurn(
  //   @MessageBody() data: { roomId: string, playerName: string },
  //   @ConnectedSocket() socket: Socket
  // ) {
  //   const state = await this.gameService.playTurn(data.roomId, data.playerName);
  //   this.server.to(data.roomId).emit('room_state', state);
  //   return state;
  // }
}
