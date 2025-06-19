export interface Card {
  suit: string;
  value: string;
  color: string;
}

export interface PlayerState {
  id: string;                    // מזהה ייחודי
  name: string;                 // שם השחקן
  handSize: number;            // כמות קלפים ביד
  visibleCards?: Card[];       // קלפים חשופים (אם יש)
  isBot?: boolean;             // האם זה בוט
  isHost?: boolean;            // האם זה יוזם המשחק
  ready?: boolean;             // האם השחקן מוכן
  score?: number;              // ניקוד (למשחקים עתידיים)
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