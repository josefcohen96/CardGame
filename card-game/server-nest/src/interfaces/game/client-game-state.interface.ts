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
  gameOver: boolean;
  winner?: string;
  sharedPile?: ICard[];
  piles?: Record<string, ICard[]>;
  board?: ICard[];
  round?: number;
  potSize?: number;
}
