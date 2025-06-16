import { ICard } from '../cards/card.interface';


export interface IPlayer {
  id: string;
  name: string;
  hand: ICard[];
  pile?: ICard[]; // ← נוספה שורה זו
  playTopCard(): ICard | undefined;
  playCardByIndex(i: number): ICard | undefined;
  receiveCard(card: ICard): void;
  receiveCards(cards: ICard[]): void;
}