import { ICard } from './card.interface';

export interface IPot {
  add(card: ICard): void;
  addCards?(cards: ICard[]): void;
  takeAll(): ICard[];
  peek?(): ICard[];
  getSize?(): number;
}
