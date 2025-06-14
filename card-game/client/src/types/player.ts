import { Card } from "./card";

export interface PlayerState {
  id: string;
  name: string;
  handSize: number;
  visibleCards?: Card[];
  isBot?: boolean;
  ready?: boolean;
  isHost?: boolean;
  score?: number;
}
