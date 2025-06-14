import { ICard } from '../../interfaces';
import { ICardValueStrategy } from '../strategies/CardValueStrategy';

export class WarCardValueStrategy implements ICardValueStrategy {
  getCardValue(card: ICard): number {
    if (card.suit === 'Joker') return 15;
    return Number(card.value);
  }
}