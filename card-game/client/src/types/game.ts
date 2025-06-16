import { Card } from "./card";

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  sharedPile?: Card[]; // קופה משותפת (למשל שיטהד או דוראק)
  piles?: Record<string, Card[]>; // לכל שחקן pile אישי (כמו מלחמה)
  board?: Card[]; // לוח פעיל (כמו דוראק או שיטהד)
  gameOver: boolean;
  winner?: string;
}

export interface PlayerState {
  id: string;                     // מזהה ייחודי
  name: string;                  // שם השחקן
  handSize: number;             // כמות קלפים ביד (לא כולל חשופים)
  visibleCards?: Card[];        // קלפים חשופים (למשל שיטהד)
  faceUpCards?: Card[];         // קלפים על השולחן (גלויים)
  faceDownCardsCount?: number;  // כמות קלפים מוסתרים (למשל שיטהד)
  pile?: Card[];                // קופה אישית (כמו מלחמה)
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