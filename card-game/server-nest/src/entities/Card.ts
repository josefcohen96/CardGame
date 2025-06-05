
import { ICard } from '../interfaces/Interfaces';
import { Suit } from '../interfaces/Suits';


export class Card implements ICard {
  constructor(
    public suit: Suit,
    public value: number,
    public color: string
  ) { }

  isJoker(): boolean {
    return this.suit === 'Joker';
  }

  toString(): string {
    if (this.isJoker()) return '🃏 Joker';
    const valueMap: Record<number, string> = {
      11: 'J',
      12: 'Q',
      13: 'K',
      14: 'A'
    };
    const displayValue = valueMap[this.value] || this.value.toString();
    return `${displayValue} of ${this.suit}`;
  }
}