import { buildStandardDeck } from '../factories/standard-deck.factory';
import { Deck } from '../entities/Deck';

export class DurakDeckFactory {
  static createDeck(): Deck {
    // In Durak, the deck is typically a standard deck without jokers
    return buildStandardDeck(2, 14, false);
  }
}
