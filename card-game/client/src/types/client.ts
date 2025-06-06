import { GameState } from "./game";
import { Card } from "./card";

export interface GameClient {
  name: string;
  startGame(): void;
  playTurn(playerIndex: number, card?: Card): void;
  getGameState(): GameState;
}
