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
  sharedPile?: ICard[];                // עבור קלפים משותפים (לדוג': שיטהד, דוראק)
  piles?: Record<string, ICard[]>;     // ערימות אישיות לכל שחקן (כמו מלחמה)
  board?: ICard[];                     // אם יש לוח פעיל (למשל בדוראק)
  gameOver: boolean;
  winner?: string;
  round?: number;                     // מספר סיבוב נוכחי (אם קיים)
  potSize?: number;     
}
