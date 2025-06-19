// src/sockets/socket.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomEvents } from './events/room.events';
import { GameEvents } from './events/game.events';
import { GameType } from 'src/interfaces';
import { SocketEmitterService } from './socket-emitter.service';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class SocketGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  public server!: Server;

  constructor(
    private readonly roomEvents: RoomEvents,
    private readonly gameEvents: GameEvents,
    private readonly socketEmitter: SocketEmitterService,
  ) {}

  afterInit() {
    this.socketEmitter.setServer(this.server);
    console.log('✅ SocketEmitter initialized');
  }

  handleConnection(socket: Socket) {
    console.log(`📡 Socket connected: ${socket.id}`);
  }

  handleDisconnect(client: Socket) {
    this.roomEvents.handleDisconnect(client);
    this.gameEvents.handleDisconnect(client);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody()
    data: { roomId: string; playerName: string; gameType: GameType },
    @ConnectedSocket() client: Socket,
  ) {
    return this.roomEvents.joinRoom(data, client);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.roomEvents.leaveRoom(data, client);
  }

  @SubscribeMessage('get-rooms')
  handleGetRooms(@ConnectedSocket() client: Socket) {
    return this.roomEvents.getRooms(client);
  }

  @SubscribeMessage('toggle-ready')
  toggleReady(
    @MessageBody() data: { roomId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.roomEvents.toggleReady(data);
  }

  @SubscribeMessage('start-game')
  start(
    @MessageBody() data: { roomId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.roomEvents.startGame(data);
  }

  @SubscribeMessage('game-move')
  handleGameMove(
    @MessageBody() data: { roomId: string; playerId: string; move: any },
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameEvents.onGameMove(data, client);
  }

  @SubscribeMessage('join-game')
  handleJoinGame(
    @MessageBody() data: { roomId: string; playerName: string; gameType: GameType },
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameEvents.joinGame(data, client);
  }
}
