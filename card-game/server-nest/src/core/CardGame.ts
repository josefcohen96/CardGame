import { Player } from 'src/entities/Player';
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

    abstract playTurn(playerId: string, move: any): void;

    abstract endGame(): void;

    getDeck(): IDeck {
        return this.deck;
    }

    getPlayers(): IPlayer[] {
        return this.players;
    }
    addPlayer(player: Player): boolean {
        if (this.players.length < 4) { // Assuming a max of 4 players
            this.players.push(player);
            return true;
        }
        return false; // Game is full
    }
    getState(): any {
        return {
            players: this.players.map(player => ({
                name: player.name,
                hand: player.hand.map(card => card.toString())
            })),
            deckSize: this.deck.getLength(),
            // Add more game state details as needed
        };
    }

}