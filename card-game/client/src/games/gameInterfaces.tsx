export interface Card {
  suit: string;
  value: string;
  color: string;
}

export interface PlayerState {
  name: string;
  handSize: number;
  visibleCards?: Card[];
}

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  pile?: Card[];
  gameOver: boolean;
  winner?: string;
}

export interface GameClient {
  name: string;
  startGame(): void;
  playTurn(playerIndex: number): void;
  getGameState(): GameState;
}