import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, OnGatewayDisconnect, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomEvents } from './events/room.events';
import { GameEvents } from './events/game.events';
import { GameType } from 'src/interfaces/Interfaces';

@WebSocketGateway({ cors: { origin: "*" }, transports: ['websocket', 'polling'] })
export class SocketGateway implements OnGatewayInit, OnGatewayDisconnect {

  /* ← הנה ה-Server שנסט דואג ליצור */
  @WebSocketServer()
  public server!: Server;
  constructor(
    private readonly roomEvents: RoomEvents,
    private readonly gameEvents: GameEvents
  ) { }
  afterInit() {
    (global as any).io = this.server;
    console.log('SocketGateway ready – io attached');
  }

  handleDisconnect(client: Socket) {
    this.roomEvents.handleDisconnect(client);
    this.gameEvents.handleDisconnect(client);
  }


  // ROOM EVENTS
  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { roomId: string; playerName: string, gameType: GameType }, @ConnectedSocket() client: Socket) {
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
  @SubscribeMessage('toggle-ready')
  toggleReady(@MessageBody() data: { roomId: string; playerId: string }, @ConnectedSocket() client: Socket) {
    return this.roomEvents.toggleReady(data, client);
  }

  @SubscribeMessage('start-game')
  start(@MessageBody() data: { roomId: string; playerId: string }, @ConnectedSocket() client: Socket) {
    return this.roomEvents.startGame(data, client);
  }
  @SubscribeMessage('game-move')
  handleGameMove(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return this.gameEvents.onGameMove(data, client);
  }
}