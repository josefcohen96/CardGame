import { ICard } from "./card";

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  sharedPile?: ICard[];                // עבור קלפים משותפים (לדוג': שיטהד, דוראק)
  piles?: Record<string, ICard[]>;     // ערימות אישיות לכל שחקן (כמו מלחמה)
  board?: ICard[];                     // אם יש לוח פעיל (למשל בדוראק)
  gameOver: boolean;
  winner?: string;
  round?: number;                     // מספר סיבוב נוכחי (אם קיים)
  potSize?: number;                   // גודל הקופה המרכזית (אם יש)
}

export interface PlayerState {
  id: string;                     // מזהה ייחודי
  name: string;                  // שם השחקן
  handSize: number;             // כמות קלפים ביד (לא כולל חשופים)
  visibleCards?: ICard[];        // קלפים חשופים (למשל שיטהד)
  faceUpCards?: ICard[];         // קלפים על השולחן (גלויים)
  faceDownCardsCount?: number;  // כמות קלפים מוסתרים (למשל שיטהד)
  pile?: ICard[];                // קופה אישית (כמו מלחמה)
  isBot?: boolean;              // האם זה בוט
  isHost?: boolean;             // האם זה יוזם המשחק
  ready?: boolean;              // האם השחקן מוכן
  score?: number;               // ניקוד (למשחקים עתידיים)
}

export enum GameType {
  WAR = "war",
  DURAK = "durak"
}

export interface GameConfig {
  label: string;
  maxPlayers: number;
  minPlayers: number;
  icon: string;
}

export const gameConfigs: Record<GameType, GameConfig> = {
  war: {
    label: "מלחמה",
    icon: "🎲",
    minPlayers: 2,
    maxPlayers: 2,
  },
  durak: {
    label: "דוראק",
    icon: "🃏",
    minPlayers: 2,
    maxPlayers: 6,
  },
};