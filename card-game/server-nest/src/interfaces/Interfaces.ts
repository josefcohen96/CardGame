// src/interfaces/IGame.ts
import { Player } from '../entities/Player';
import { Suit } from './Suits';

export enum GameType {
  DURAK = 'durak',
  WAR = 'war',
}
export interface IGame {
  startGame(): GameState;
  playTurn(playerId: string, move: any): GameState;
  endGame(): GameState;
  addPlayer(player: Player): boolean;
  getState(): GameState;
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

export interface StartDto {
  roomId: string;
  playerId: string;
}

export interface GameState {
  gameId: string;
  players: IPlayer[];
  deck: IDeck;
  pot: IPot;
  currentPlayerIndex: number;
  turnHistory: any[];
  gameOver: boolean;
  winner?: IPlayer;
}

export interface RoomPlayer {
  id: string;
  name: string;
  ready: boolean;
  isHost: boolean;
}
export interface Room {
  id: string;
  type: GameType;
  maxPlayers: number;
  gameStarted: boolean;
  players: RoomPlayer[];
}