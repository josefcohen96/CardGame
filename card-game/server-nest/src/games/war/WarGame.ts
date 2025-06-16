// Path: src/games/war/WARGame.ts
import { CardGame } from '../../games/core/CardGame';
import { IPlayer } from '../../interfaces';
import { WarDeckFactory } from './WarDeckFactory';
import { WarPot } from './WarPot';
import { WarCardValueStrategy } from './WarCardValueStrategy';
import { ICard } from '../../interfaces';
import { GameType } from '../../interfaces';
import { GameState } from '../../interfaces';
import { GameFactory } from '../factories/game.factory';

export class WarGame extends CardGame {
    /* שדות ספציפיים למשחק War */
    protected readonly pot: WarPot;
    private readonly cardValueStrategy: WarCardValueStrategy;

    private round = 0;                     // מונה סיבובים

    constructor(players: IPlayer[]) {
        /* דק מלא של 52 קלפים (“2”-“A”) */
        super(GameType.WAR, WarDeckFactory.createDeck(), players);

        this.pot = new WarPot();
        this.cardValueStrategy = new WarCardValueStrategy();

        this.dealCardsEvenly();
    }

    /* --------------------------------------------------------------- */
    /*                 לוגיקת הכנה ו utility פנימיים                  */
    /* --------------------------------------------------------------- */

    /** חלוקת כל הדק שווה-בשווה בין השחקנים */
    private dealCardsEvenly() {
        this.deck.shuffle();

        let i = 0;
        while (this.deck.getLength() > 0) {
            const card = this.deck.draw();
            if (card) {
                this.players[i % this.players.length].receiveCard(card);
                i++;
            }
        }
    }

    /* --------------------------------------------------------------- */
    /*              מימוש המתודות המחויבות ב-interface IGame           */
    /* --------------------------------------------------------------- */

    /** התחלת המשחק - מחזיר GameState ראשוני */
    startGame(): GameState {
        this.round = 1;
        return this.getState();
    }

    /**
     * ביצוע תור מלא (ב־War כל השחקנים חושפים קלף יחד)
     * @returns  GameState עדכני לאחר התור
     */
    playTurn(_playerId: string, _move: any): GameState {
        if (this.gameOver) return this.getState();

        this.round++;
        const played: { player: IPlayer; card: ICard }[] = [];

        // כל שחקן חושף קלף עליון
        for (const player of this.players) {
            const card = player.playTopCard();
            if (card) {
                this.pot.add(card);
                played.push({ player, card });
            }
        }

        /* אין קלפים – המשחק נגמר */
        if (played.length === 0) {
            return this.endGame();
        }

        /* קביעת המנצח/תיקו */
        const maxVal = Math.max(...played.map(p => this.cardValueStrategy.getCardValue(p.card)));
        const winners = played.filter(p => this.cardValueStrategy.getCardValue(p.card) === maxVal);

        if (winners.length === 1) {
            /* מנצח יחיד – לוקח את הקופה */
            winners[0].player.receiveCards(this.pot.takeAll());
        }
        /* תיקו – שום דבר לא קורה; הקופה נשארת */

        /* בדיקת סיום – מי שנשארו לו קלפים בסוף הוא המנצח */
        const activePlayers = this.players.filter(p => p.hand.length > 0);
        if (activePlayers.length <= 1) {
            return this.endGame(activePlayers[0]);
        }

        return this.getState();
    }

    /** סיום המשחק */
    endGame(winner?: IPlayer): GameState {
        this.gameOver = true;
        const state = this.getState();
        state.winner = winner;
        return state;
    }

    /* --------------------------------------------------------------- */
    /*          הרחבה קלה ל-getState כדי לכלול round & pot            */
    /* --------------------------------------------------------------- */

    getState(): GameState {
        const base = super.getState();
        return {
            ...base,
            round: this.round,
            potSize: this.pot.getSize(),
        } as GameState & { round: number; potSize: number };
    }
}

/* ------------------------------------------------------------------ */
/*                 רישום המשחק בפקטורי – חובה!                        */
/* ------------------------------------------------------------------ */
GameFactory.register(GameType.WAR, WarGame);