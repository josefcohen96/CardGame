import { Card } from '../entities/Card';
import { Suit } from '../interfaces/Suits';
import { ICard } from '../interfaces/Interfaces';
import { IDeck } from '../interfaces/Interfaces';
import { Deck } from '../entities/Deck';
export class StandardDeckFactory implements IDeck {
  protected suits: Suit[] = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
  protected minValue: number = 2;
  protected maxValue: number = 14;
  protected includeJokers: boolean = false;

  public cards: ICard[] = [];

  constructor() {
    this.buildDeck();
    this.shuffle();
  }

  public buildDeck(min = 2, max = 14, includeJokers = false): Deck {
    const cards: ICard[] = [];
    const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];

    for (const suit of suits) {
      const color = (suit === Suit.Hearts || suit === Suit.Diamonds) ? 'red' : 'black';
      for (let value = min; value <= max; value++) {
        cards.push(new Card(suit, value, color));
      }
    }

    if (includeJokers) {
      cards.push(new Card(Suit.Joker, 999, 'red'));
      cards.push(new Card(Suit.Joker, 999, 'black'));
    }

    return new Deck(cards);

  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): ICard | null {
    return this.cards.pop() || null;
  }

  getLength(): number {
    return this.cards.length;
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  getAllCards(): ICard[] {
    return [...this.cards];
  }
}
