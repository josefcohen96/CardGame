import { ICard } from '../../interfaces';

import { IPot } from '../../interfaces';

export abstract class AbstractPot implements IPot {
  protected cards: ICard[] = [];

  add(card: ICard): void {
    this.cards.push(card);
  }

  addCards(cards: ICard[]): void {
    this.cards.push(...cards);
  }

  takeAll(): ICard[] {
    const all = [...this.cards];
    this.cards = [];
    return all;
  }

  peek(): ICard[] {
    return [...this.cards];
  }

  getSize(): number {
    return this.cards.length;
  }
}