// src/interfaces/IGame.ts
import { Player } from '../entities/Player';
import { Suit } from './Suits';


export interface IGame {
  startGame(): void;
  playTurn(player: Player): void;
  endGame(): void;
}

export interface ICard {
  value: number;
  suit: Suit;
  color: string;
  isJoker?(): boolean; 
  toString(): string;
}

export interface IPlayer {
  name: string;
  hand: ICard[];
  playTopCard(): ICard | undefined;
  receiveCard(card: ICard): void;
  receiveCards(cards: ICard[]): void;
  playCardByIndex(index: number): ICard | undefined;
}

export interface IDeck {
  // add protected cards
  cards: ICard[];
  shuffle(): void;
  draw(): ICard | null;
  getLength(): number;
  isEmpty(): boolean;
  getAllCards?(): ICard[];
}

export interface IPot {
  add(card: ICard): void;
  addCards?(cards: ICard[]): void;
  takeAll(): ICard[];
  peek?(): ICard[];
  getSize?(): number;
}
