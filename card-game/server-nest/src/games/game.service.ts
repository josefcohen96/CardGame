import { Injectable } from '@nestjs/common';
import { Player } from '../entities/Player';
import { GameFactory } from './GameFactory';
import { GameType, GameState, IGame } from '../interfaces/Interfaces';

@Injectable()
export class GameService {
  private games = new Map<string, IGame>();

  /** יצירה + הפעלה מידית */
  createGame(players: Player[], gameType: GameType): { gameId: string; state: GameState } {
    const gameId = `${gameType}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const game = GameFactory.create(gameType, players);
    if (!game) throw new Error(`Unsupported game type: ${gameType}`);

    this.games.set(gameId, game);
    const state = game.startGame();       // מחזיר GameState מוכן לשליחה
    return { gameId, state };
  }

  playTurn(gameId: string, playerId: string, move: any): GameState {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.playTurn(playerId, move);
  }

  getState(gameId: string): GameState {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.getState();
  }

  removeGame(gameId: string) { this.games.delete(gameId); }
}
