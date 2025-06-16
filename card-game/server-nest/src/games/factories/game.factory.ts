// src/games/factories/game.factory.ts
import { GameType } from '../../interfaces';
import { IGame } from '../../interfaces';

type GameCtor = new (...args: any[]) => IGame;

export class GameFactory {
  /** Map<type, constructor> */
  private static readonly registry = new Map<GameType, GameCtor>();

  static register(type: GameType, ctor: GameCtor): void {
    this.registry.set(type, ctor);
  }

  static create(type: GameType, ...args: unknown[]): IGame {
    const Ctor = this.registry.get(type);
    if (!Ctor) throw new Error(`Unknown game type: ${type}`);
    return new Ctor(...args) as IGame;
  }
}
