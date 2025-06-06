import { PlayerState } from "./player";
import { Card } from "./card";

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  pile?: Card[];
  gameOver: boolean;
  winner?: string;
  [key: string]: any; // להרחבה עתידית
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