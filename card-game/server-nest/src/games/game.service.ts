import { Injectable } from '@nestjs/common';
import { Player } from '../entities/Player';
import { GameFactory } from '../games/GameFactory';
import { IGame } from '../interfaces/Interfaces';
import { GameType } from '../interfaces/Interfaces';

@Injectable()
export class GameService {
  private games: Map<string, IGame> = new Map();

  createGame(player: Player, gameType: GameType): string {
    const gameId = `${gameType}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const game = GameFactory.create(gameType, [player]);

    if (!game) {
      throw new Error(`Game type "${gameType}" is not supported`);
    }

    this.games.set(gameId, game);
    return gameId;
  }

  joinGame(gameId: string, player: Player): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;
    return game.addPlayer(player);
  }

  playTurn(gameId: string, playerId: string, move: any): any {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.playTurn(playerId, move)

  }

  getGameState(gameId: string): any {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.getState();
  }

  removeGame(gameId: string): void {
    this.games.delete(gameId);
  }
}
