import { ICard } from '../../interfaces';
import { Suit } from '../../interfaces/suits.enum';

export class DurakCardValueStrategy {
  constructor(private trumpSuit: Suit) {}

  isTrump(card: ICard): boolean {
    return card.suit === this.trumpSuit;
  }

  canBeat(attacking: ICard, defending: ICard): boolean {
    if (defending.suit === attacking.suit) {
      return defending.value > attacking.value;
    }
    if (this.isTrump(defending) && !this.isTrump(attacking)) {
      return true;
    }
    return false;
  }

  getTrump(): Suit {
    return this.trumpSuit;
  }
} 
