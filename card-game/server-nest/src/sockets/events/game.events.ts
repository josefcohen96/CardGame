// src/sockets/events/game.events.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';
import { SocketEmitterService } from '../socket-emitter.service';

@Injectable()
export class GameEvents {
  constructor(
    private readonly gameService: GameService,
    private readonly socketEmitter: SocketEmitterService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log(`⚠️ [GameEvents] Client disconnected: ${client.id}`);
    // Future: ניתוק שחקן באמצע תור וכו'
  }

  onGameMove(
    data: { roomId: string; playerId: string; move: any },
    client: Socket,
  ) {
    try {
      const updatedState = this.gameService.playTurn(
        data.roomId,
        data.playerId,
        data.move,
      );
      this.socketEmitter.emitToRoom(data.roomId, 'game-state', updatedState);
      this.socketEmitter.emitToClient(client.id, 'game-state', updatedState);
    } catch (e) {
      this.socketEmitter.emitToClient(client.id, 'error', {
        message: e.message,
      });
    }
  }
}
