import { Card } from "./card";

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  pile?: Card[];
  gameOver: boolean;
  winner?: string;
  [key: string]: any; // להרחבה עתידית
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