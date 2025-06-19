import { ICard } from '../cards/card.interface';


export interface IPlayer {
  id: string;
  name: string;
  hand: ICard[];
  pile?: ICard[]; 
  playTopCard?(): ICard | undefined;
  playCardByIndex?(i: number): ICard | undefined;
  receiveCard?(card: ICard): void;
  receiveCards?(cards: ICard[]): void;
}