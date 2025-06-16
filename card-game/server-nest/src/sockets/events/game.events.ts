import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';

@Injectable()
export class GameEvents {
  private states: Record<string, any> = {};
  constructor(private readonly gameService: GameService) { }
  handleDisconnect(client: Socket) {
    for (const roomId of Object.keys(this.states)) {
      const state = this.states[roomId];
      const index = state.players.findIndex((p: any) => p.id === client.id);
      if (index !== -1) {
        state.players.splice(index, 1);
        if (state.players.length === 0) {
          delete this.states[roomId];
        } else {
          if (state.currentPlayerIndex >= state.players.length) {
            state.currentPlayerIndex = 0;
          }
          client.to(roomId).emit('game-state', state);
        }
      }
    }
  }

  joinGame(data: { roomId: string; playerName: string }, client: Socket) {
    const { roomId, playerName } = data;
    client.join(roomId);

    if (!this.states[roomId]) {
      this.states[roomId] = {
        started: false,
        players: [],
        currentPlayerIndex: 0,
        gameOver: false,
      };
    }

    const state = this.states[roomId];
    if (!state.players.find((p: any) => p.id === client.id)) {
      state.players.push({ id: client.id, name: playerName, handSize: 0 });
    }

    this.broadcastState(roomId, client);
  }
  startGame(data: { roomId: string }, client: Socket) {
    // לוגיקה לאתחול משחק (למשל, לשמור/להחזיר מצב משחק התחלתי)
    client.to(data.roomId).emit('game-started');
    const { roomId } = data;
    if (!this.states[roomId]) {
      this.states[roomId] = {
        started: true,
        players: [],
        currentPlayerIndex: 0,
        gameOver: false,
      };
    } else {
      this.states[roomId].started = true;
    }
    const state = this.states[roomId];
    client.to(roomId).emit('game-started');
    client.emit('game-started');
    this.broadcastState(roomId, client);
  }

  onGameMove(data: { roomId: string; playerId: string; move: any }, client: Socket) {
    try {
      const updatedState = this.gameService.playTurn(data.roomId, data.playerId, data.move);
      client.to(data.roomId).emit('game-state', updatedState);
      client.emit('game-state', updatedState);
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  private broadcastState(roomId: string, client: Socket) {
    const state = this.states[roomId];
    if (!state) return;
    client.to(roomId).emit('game-state', state);
    client.emit('game-state', state);
  }
}