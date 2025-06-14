import { Player } from 'src/entities/Player';
import { IDeck, GameState, IPlayer, IGame, IPot } from '../interfaces/Interfaces';

export abstract class CardGame implements IGame {
    protected players: IPlayer[];
    protected deck: IDeck;
    protected turnHistory: any[] = [];
    protected currentPlayerIndex = 0;
    protected gameOver = false;
    protected pot: IPot; // סכום הקופה, יכול להיות גם אובייקט IPot

    constructor(deck: IDeck, players: IPlayer[]) {
        this.deck = deck;
        this.players = players;
    }

    /* --- מחייב כל משחק לממש --- */
    abstract startGame(): GameState;
    abstract playTurn(playerId: string, move: any): GameState;
    abstract endGame(): GameState;

    /* --- לוגיקה/עזר משותפים --- */

    /** ברירת-מחדל: ניסיון להוסיף שחקן עד מקס׳ 4 */
    addPlayer(player: Player): boolean {
        if (this.players.length >= 4) return false;
        this.players.push(player);
        return true;
    }

    /** צילום מצב אחיד; משחק קונקרטי יכול להרחיב */
    getState(): GameState {
        return {
            gameId: '',                // ימולא ע״י GameService
            players: this.players,
            deck: this.deck,
            pot: this.pot,
            currentPlayerIndex: this.currentPlayerIndex,
            turnHistory: this.turnHistory,
            gameOver: this.gameOver,
        };
    }

    /* getter בסיסי למי שזקוק */
    getDeck() { return this.deck; }
    getPlayers() { return this.players; }
}
