import { Player } from '../../games/entities/Player';
import { GameState } from './game-state.interface';

export interface IGame {
  startGame(): GameState;
  playTurn(playerId: string, move: any): GameState;
  endGame():   GameState;
  addPlayer(player: Player): boolean;
  getState(): GameState;
}
