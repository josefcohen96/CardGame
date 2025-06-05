import { IPlayer } from "../interfaces/Interfaces";
import { ICard } from "../interfaces/Interfaces";

export class Player implements IPlayer {
  public hand: ICard[] = [];
  public name: string;
  public id: string = Math.random().toString(36).substring(2, 15); // Simple ID generation
  constructor(name: string) {
    this.name = name;
  }

  playTopCard(): ICard | undefined {
    return this.hand.shift();
  }

  receiveCard(card: ICard): void {
    this.hand.push(card);
  }

  receiveCards(cards: ICard[]): void {
    this.hand.push(...cards);
  }

  playCardByIndex(index: number): ICard | undefined {
    if (index >= 0 && index < this.hand.length) {
      return this.hand.splice(index, 1)[0];
    }
    return undefined;
  }
}
