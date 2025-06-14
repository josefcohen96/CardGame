import { Suit } from '../suits.enum';

export interface ICard {
  value: number;
  suit: Suit;
  color: string;
  isJoker?(): boolean;
  toString(): string;
}
