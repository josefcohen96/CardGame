import { buildStandardDeck } from '../factories/standard-deck.factory';
import { IDeck } from '../../interfaces';


export class WarDeckFactory {
  static createDeck(): IDeck {
    console.log("Creating War deck in WarDeckFactory.ts");
    return buildStandardDeck(2, 14, false);
  }
}