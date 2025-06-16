// interfaces/game/game.interface.ts
import { Player } from '../../games/entities/Player';
import { ClientGameState } from './client-game-state.interface'; // <- חדש

export interface IGame {
  startGame(): ClientGameState;
  playTurn(playerId: string, move: any): ClientGameState;
  endGame(): ClientGameState;
  addPlayer(player: Player): boolean;
  getState(): ClientGameState;
}