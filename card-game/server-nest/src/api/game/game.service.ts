import { Injectable } from '@nestjs/common';
import { IPlayer } from '../../interfaces';
import { GameFactory } from '../../games/factories/game.factory';
import { GameType } from '../../interfaces';
import { IGame } from '../../interfaces/game/game.interface';
import { ClientGameState } from '../../interfaces/game/client-game-state.interface';

@Injectable()
export class GameService {
  private games = new Map<string, IGame>();

  createGame(players: IPlayer[], gameType: GameType): { gameId: string; state: ClientGameState } {
    const gameId = `${gameType}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const game = GameFactory.create(gameType, players);
    if (!game) throw new Error(`Unsupported game type: ${gameType}`);

    this.games.set(gameId, game);
    const state = game.startGame();
    return { gameId, state };
  }

  playTurn(gameId: string, playerId: string, move: any): ClientGameState {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.playTurn(playerId, move);
  }

  getState(gameId: string): ClientGameState {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    return game.getState();
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }
}
