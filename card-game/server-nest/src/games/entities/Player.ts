import { IPlayer } from '../../interfaces';
import { ICard } from '../../interfaces';
export abstract class AbstractPlayer implements IPlayer {
  id: string;
  name: string;
  hand: ICard[] = [];
  pile: ICard[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  abstract playTopCard(): ICard | undefined;
  abstract playCardByIndex(i: number): ICard | undefined;

  receiveCard(card: ICard): void {
    this.hand.push(card);
  }

  receiveCards(cards: ICard[]): void {
    this.pile.push(...cards);
  }
}