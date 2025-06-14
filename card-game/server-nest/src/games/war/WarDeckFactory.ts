import { buildStandardDeck } from '../factories/standard-deck.factory';
import { Deck } from '../entities/Deck';


export class WarDeckFactory {
  static createDeck(): Deck {
    return buildStandardDeck(2, 14, false);
  }
}