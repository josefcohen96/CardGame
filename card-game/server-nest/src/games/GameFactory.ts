import { IGame } from '../interfaces/Interfaces';

type GameConstructor = new (...args: any[]) => IGame;

export class GameFactory {
    private static registry: Map<string, GameConstructor> = new Map();

    static register(gameType: string, ctor: GameConstructor) {
        this.registry.set(gameType, ctor);
    }

    static create(gameType: string, ...args: any[]): IGame {
        const ctor = this.registry.get(gameType);
        if (!ctor) {
            throw new Error(`Unknown game type: ${gameType}`);
        }
        return new ctor(...args);
    }

}