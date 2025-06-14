// src/games/factories/standard-deck.factory.ts
import { Suit } from '../../interfaces/suits.enum';
import { ICard, IDeck } from '../../interfaces';
import { Card } from '../entities/Card';
import { Deck } from '../entities/Deck';

export function buildStandardDeck(
  min: number = 2,
  max: number = 14,
  includeJokers = false,
): Deck {
  const cards: ICard[] = [];

  const suits: Suit[] = [
    Suit.Clubs,
    Suit.Diamonds,
    Suit.Hearts,
    Suit.Spades,
  ];

  for (const suit of suits) {
    const color = suit === Suit.Hearts || suit === Suit.Diamonds ? 'red' : 'black';
    for (let val = min; val <= max; val++) {
      cards.push(new Card(suit, val, color));
    }
  }

  if (includeJokers) {
    cards.push(new Card(Suit.Joker, 999, 'red'));
    cards.push(new Card(Suit.Joker, 999, 'black'));
  }

  const deck = new Deck(cards);
  deck.shuffle();
  return deck;
}