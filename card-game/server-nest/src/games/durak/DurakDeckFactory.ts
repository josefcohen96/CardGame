import { StandardDeckFactory } from '../../factories/StandardDeckFactory';
import { Deck } from '../../entities/Deck';

export class DurakDeckFactory extends StandardDeckFactory {
  constructor() {
    super();
  }

  static createDeck(): Deck {
    const factory = new DurakDeckFactory();
    return factory.buildDeck(6, 14, false); // ערכים 6-14, בלי ג'וקרים
  }
}