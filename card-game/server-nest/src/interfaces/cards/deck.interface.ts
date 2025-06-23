import { ICard } from './card.interface';

export interface IDeck {
  cards: ICard[];
  shuffle(): void;
  draw(): ICard | null;
  getLength(): number;
  isEmpty(): boolean;
  getAllCards(): ICard[];
}
