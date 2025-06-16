// core/CardGame.ts
import { Player } from '../entities/Player';
import {
    IDeck,
    IPot,
    IPlayer,
    IGame,
    GameType,
} from '../../interfaces';
import {
    ClientGameState,
    ClientPlayerState,
} from '../../interfaces/game/client-game-state.interface';

export abstract class CardGame implements IGame {
    protected readonly gameType: GameType;
    protected players: IPlayer[];
    protected deck: IDeck;
    protected pot!: IPot;
    protected turnHistory: any[] = [];
    protected currentPlayerIndex = 0;
    protected gameOver = false;

    constructor(gameType: GameType, deck: IDeck, players: IPlayer[]) {
        this.gameType = gameType;
        this.deck = deck;
        this.players = players;
    }

    abstract startGame(): ClientGameState;
    abstract playTurn(playerId: string, move: any): ClientGameState;
    abstract endGame(): ClientGameState;

    addPlayer(player: Player): boolean {
        if (this.players.length >= 4) return false;
        this.players.push(player);
        return true;
    }

    getState(): ClientGameState {
        const players: ClientPlayerState[] = this.players.map(p => ({
            id: p.id,
            name: p.name,
            handSize: p.hand.length,
            score: 0,
        }));

        return {
            players,
            currentPlayerIndex: this.currentPlayerIndex,
            gameOver: this.gameOver,
            winner: undefined,
        };
    }

    getDeck() {
        return this.deck;
    }

    getPlayers() {
        return this.players;
    }
}
