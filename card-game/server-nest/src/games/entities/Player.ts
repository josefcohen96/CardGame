import { IPlayer, ICard } from '../../interfaces';

export class Player implements IPlayer {
  id: string;
  name: string;
  hand: ICard[] = [];
  pile: ICard[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  playTopCard(): ICard | undefined {
    return this.hand.shift();
  }

  playCardByIndex(i: number): ICard | undefined {
    if (i >= 0 && i < this.hand.length) {
      return this.hand.splice(i, 1)[0];
    }
    return undefined;
  }

  receiveCard(card: ICard): void {
    this.pile.push(card);
  }

  receiveCards(cards: ICard[]): void {
    this.pile.push(...cards);
  }
}