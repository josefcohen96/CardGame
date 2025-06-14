import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomEvents } from './events/room.events';
import { GameEvents } from './events/game.events';

@WebSocketGateway({ cors: { origin: "*" }, transports: ['websocket', 'polling'] })
export class SocketGateway implements OnGatewayDisconnect {
  constructor(
    private readonly roomEvents: RoomEvents,
    private readonly gameEvents: GameEvents
  ) {
    console.log('SocketGateway initialized');
  }

  handleDisconnect(client: Socket) {
    this.roomEvents.handleDisconnect(client);
    this.gameEvents.handleDisconnect(client);
  }

  // ROOM EVENTS
  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { roomId: string; playerName: string }, @ConnectedSocket() client: Socket) {
    console.log('Join room event received:', data);
    return this.roomEvents.joinRoom(data, client);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    return this.roomEvents.leaveRoom(data, client);
  }

  @SubscribeMessage('get-rooms')
  handleGetRooms(@ConnectedSocket() client: Socket) {
    return this.roomEvents.getRooms(client);
  }

  @SubscribeMessage('join-game')
  handleJoinGame(@MessageBody() data: { roomId: string; playerName: string }, @ConnectedSocket() client: Socket) {
    return this.gameEvents.joinGame(data, client);
  }

  // GAME EVENTS
  @SubscribeMessage('start-game')
  handleStartGame(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    return this.gameEvents.startGame(data, client);
  }

  @SubscribeMessage('game-move')
  handleGameMove(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return this.gameEvents.onGameMove(data, client);
  }
}