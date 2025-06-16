import { buildStandardDeck } from '../factories/standard-deck.factory';
import { Deck } from '../entities/Deck';


export class WarDeckFactory {
  static createDeck(): Deck {
    console.log("Creating War deck in WarDeckFactory.ts");
    return buildStandardDeck(2, 14, false);
  }
}