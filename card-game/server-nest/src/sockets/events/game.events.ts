import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameEvents {
  private states: Record<string, any> = {};

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

  onGameMove(data: any, client: Socket) {
    // ביצוע מהלך, עדכון מצב המשחק וכו'
    // לדוג׳:
    // client.to(data.roomId).emit('game-update', {...});
    const { roomId } = data;
    const state = this.states[roomId];
    if (state) {
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      this.broadcastState(roomId, client);
    }
  }

  private broadcastState(roomId: string, client: Socket) {
    const state = this.states[roomId];
    if (!state) return;
    client.to(roomId).emit('game-state', state);
    client.emit('game-state', state);
  }
}