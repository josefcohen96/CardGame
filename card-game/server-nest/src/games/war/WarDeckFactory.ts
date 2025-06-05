import { StandardDeckFactory } from '../../factories/StandardDeckFactory';
import { Deck } from '../../entities/Deck';

export class WarDeckFactory extends StandardDeckFactory {
  constructor() {
    super();  // Call the parent constructor to initialize the deck
  }

  static createDeck(): Deck {
    const factory = new WarDeckFactory();
    return factory.buildDeck(2, 14, true); 
  }
}