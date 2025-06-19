import { ICard } from '../cards/card.interface';

export interface ClientPlayerState {
  id: string;
  name: string;
  handSize: number;
  visibleCards?: ICard[];
  score?: number;
}

export interface ClientGameState {
  players: ClientPlayerState[];
  currentPlayerIndex: number;
  sharedPile?: ICard[];
  piles?: Record<string, ICard[]>;
  board?: ICard[];
  gameOver: boolean;
  winner?: string;
  round?: number;
  potSize?: number;
}
