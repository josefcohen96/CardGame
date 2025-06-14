// card-game/server-nest/src/games/core/CardGame.ts
import { Player } from '../entities/Player';
import {
    IDeck, IPot, IPlayer,
    GameState, IGame, GameType
} from '../../interfaces';

export abstract class CardGame implements IGame {
    protected readonly gameType: GameType;
    protected players: IPlayer[];
    protected deck: IDeck;
    protected pot!: IPot;
    protected turnHistory: any[] = [];
    protected currentPlayerIndex = 0;
    protected gameOver = false;

    constructor(
        gameType: GameType,
        deck: IDeck,
        players: IPlayer[],
    ) {
        this.gameType = gameType;
        this.deck = deck;
        this.players = players;
    }


    /* --- חובה לממש במשחק הספציפי --- */
    abstract startGame(): GameState;
    abstract playTurn(playerId: string, move: any): GameState;
    abstract endGame(): GameState;

    /* --- הוספת/קבלת שחקנים --- */
    addPlayer(player: Player): boolean {
        if (this.players.length >= 4) return false;   // אפשר להזיח לקונפיג
        this.players.push(player);
        return true;
    }

    /* --- מציג מצב עדכני של המשחק --- */
    getState(): GameState {
        return {
            gameId: '',                        // GameService ינפיק
            type: this.gameType,             // ←  הוספנו!
            players: this.players,
            deck: this.deck,
            pot: this.pot,
            currentPlayerIndex: this.currentPlayerIndex,
            turnHistory: this.turnHistory,
            gameOver: this.gameOver,
            winner: undefined,

        };
    }

    /* --- getters נוחים --- */
    getDeck() { return this.deck; }
    getPlayers() { return this.players; }
}
