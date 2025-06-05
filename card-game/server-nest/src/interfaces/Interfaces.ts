// src/interfaces/IGame.ts
import { Player } from '../entities/Player';
import { Suit } from './Suits';

export enum GameType {
  DURAK = 'durak',
  WAR = 'war',
}
export interface IGame {
  startGame(): void;
  playTurn(playerId: string, move: any): void;
  endGame(): void;
  addPlayer(player: Player): boolean;
  getState(): any;
}

export interface ICard {
  value: number;
  suit: Suit;
  color: string;
  isJoker?(): boolean;
  toString(): string;
}

export interface IPlayer {
  id: string;
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
