// src/sockets/events/game.events.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';
import { IPlayer, GameType } from '../../interfaces';
import { SocketEmitterService } from '../socket-emitter.service';

@Injectable()
export class GameEvents {
  constructor(
    private readonly gameService: GameService,
    private readonly socketEmitter: SocketEmitterService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log(`⚠️ [GameEvents] Client disconnected: ${client.id}`);
  }

  joinGame(
    data: { roomId: string; playerName: string; gameType: GameType },
    client: Socket,
  ) {
    const { roomId, playerName, gameType } = data;
    client.join(roomId);

    const player: IPlayer = {
      id: client.id,
      name: playerName,
      hand: [],
    };

    let gameState;
    try {
      gameState = this.gameService.getState(roomId);
    } catch {
      const { state } = this.gameService.createGame([player], gameType);
      gameState = state;
    }

    this.socketEmitter.emitToRoom(roomId, 'game-state', gameState);
    this.socketEmitter.emitToClient(client.id, 'game-joined', {
      roomId,
      player: player.name,
    });
  }

  startGame(data: { roomId: string; playerId: string }, client: Socket) {
    const { roomId } = data;
    const state = this.gameService.getState(roomId);

    this.socketEmitter.emitToRoom(roomId, 'game-started', state);
    this.socketEmitter.emitToClient(client.id, 'game-started', state);
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
