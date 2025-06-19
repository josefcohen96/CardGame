// interfaces/game/game.interface.ts
import { IPlayer } from '../../interfaces/';
import { ClientGameState } from './client-game-state.interface';


export interface IGame {
  startGame(): ClientGameState;
  playTurn(playerId: string, move: any): ClientGameState;
  endGame(): ClientGameState;
  addPlayer(player: IPlayer): boolean;
  getState(): ClientGameState;
}