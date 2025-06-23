// core/CardGame.ts
import { IPot, IPlayer, ICardGame, GameType } from '../../interfaces';
import { ClientGameState } from '../../interfaces/game/client-game-state.interface';

export abstract class CardGame implements ICardGame {
    protected readonly gameType: GameType;
    protected players: IPlayer[] = [];
    protected pot!: IPot;
    protected turnHistory: any[] = [];
    protected currentPlayerIndex = 0;
    protected gameOver = false;

    constructor(gameType: GameType) {

        this.gameType = gameType;
    }

    abstract startGame(): ClientGameState;
    abstract playTurn(playerId: string, move: any): ClientGameState;
    abstract endGame(): ClientGameState;
    abstract getState(): ClientGameState;

    addPlayer(player: IPlayer): boolean {
        if (this.players.length < 4) {
            this.players.push(player);
            return true;
        }
        return false;
    }
    
    getPlayers() {
        return this.players;
    }
}
