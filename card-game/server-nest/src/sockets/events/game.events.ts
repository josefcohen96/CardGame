// game-events.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';
import { IPlayer } from '../../interfaces';
import { GameType } from '../../interfaces';

@Injectable()
export class GameEvents {
  constructor(private readonly gameService: GameService) {}

  handleDisconnect(client: Socket) {
    // אתה יכול להרחיב את GameService לטפל בשחקנים ניתקים בעתיד
    console.log(`Client disconnected: ${client.id}`);
  }

  joinGame(data: { roomId: string; playerName: string; gameType: GameType }, client: Socket) {
    const { roomId, playerName, gameType } = data;
    client.join(roomId);

    // צור אובייקט שחקן
    const player: IPlayer = {
      id: client.id,
      name: playerName,
      hand: [], // אפשר לשפר אם צריך
    };

    // בדוק אם המשחק כבר קיים
    let gameState;
    try {
      gameState = this.gameService.getState(roomId);
    } catch {
      // אם המשחק לא קיים – צור אותו
      const { state } = this.gameService.createGame([player], gameType);
      gameState = state;
    }

    // אם המשחק קיים – הוסף שחקן (בהנחה שה־IGame תומך בפונקציה מתאימה)
    // תוכל להוסיף `addPlayer()` ל־IGame אם צריך
    // לדוגמה:
    // this.gameService.addPlayer(roomId, player);

    this.broadcastState(roomId, gameState, client);
  }

  startGame(data: { roomId: string; playerId: string }, client: Socket) {
    const { roomId } = data;
    // הפעל את המשחק דרך GameService
    const state = this.gameService.getState(roomId); // start כבר בוצע בתוך createGame
    client.to(roomId).emit('game-started', state);
    client.emit('game-started', state);
  }

  onGameMove(data: { roomId: string; playerId: string; move: any }, client: Socket) {
    try {
      const updatedState = this.gameService.playTurn(data.roomId, data.playerId, data.move);
      this.broadcastState(data.roomId, updatedState, client);
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  private broadcastState(roomId: string, state: any, client: Socket) {
    client.to(roomId).emit('game-state', state);
    client.emit('game-state', state);
  }
}
