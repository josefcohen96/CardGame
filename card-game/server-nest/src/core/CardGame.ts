import { IDeck } from '../interfaces/Interfaces';
import { IPlayer } from '../interfaces/Interfaces';
import { IGame } from '../interfaces/Interfaces';


export abstract class CardGame implements IGame {
    protected players: IPlayer[];
    protected deck: IDeck;

    constructor(deck: IDeck, players: IPlayer[]) {
        this.deck = deck;
        this.players = players;
    }

    abstract startGame(): void;

    abstract playTurn(player: IPlayer): void;

    abstract endGame(): void;

    getDeck(): IDeck {
        return this.deck;
    }

    getPlayers(): IPlayer[] {
        return this.players;
    }
    
}