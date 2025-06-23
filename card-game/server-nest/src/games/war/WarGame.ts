import { CardGame } from '../core/CardGame';
import { WarPlayer } from './WarPlayer';
import { WarDeckFactory } from './WarDeckFactory';
import { WarCardValueStrategy } from './WarCardValueStrategy';
import { ClientGameState, ClientPlayerState } from '../../interfaces/game/client-game-state.interface';
import { IPlayer, ICard } from '../../interfaces';
import { GameType } from '../../interfaces';
import { IDeck } from '../../interfaces';

export class WarGame extends CardGame {
    private readonly deck: IDeck = WarDeckFactory.createDeck();
    private readonly cardValueStrategy = new WarCardValueStrategy();
    protected players: WarPlayer[] = [];

    constructor() {
        super(GameType.WAR);
    }

    addPlayer(player: IPlayer): boolean {
        if (this.players.length >= 2) return false;
        const warPlayer = new WarPlayer(player.id, player.name);
        this.players.push(warPlayer);
        return true;
    }

    startGame(): ClientGameState {
        this.deck.shuffle();
        const cards = this.deck.getAllCards();
        for (let i = 0; i < cards.length; i++) {
            const currentPlayer = this.players[i % this.players.length];
            currentPlayer.hand.push(cards[i]);
        }
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        return this.getState();
    }

    playTurn(playerId: string): ClientGameState {
        if (this.players.length !== 2) {
            throw new Error('War requires exactly 2 players.');
        }

        const [p1, p2] = this.players;

        const card1 = p1.playTopCard();
        const card2 = p2.playTopCard();

        if (!card1 || !card2) {
            this.gameOver = true;
            return this.getState();
        }

        const value1 = this.cardValueStrategy.getCardValue(card1);
        const value2 = this.cardValueStrategy.getCardValue(card2);

        // נאחסן את הקלפים שעל השולחן כדי לחשוף אותם ללקוח
        p1.lastPlayedCard = card1;
        p2.lastPlayedCard = card2;

        const pot: ICard[] = [card1, card2];

        if (value1 > value2) {
            p1.pile.push(...pot);
        } else if (value2 > value1) {
            p2.pile.push(...pot);
        } else {
            // תיקו – לשלב הבא תוכל להוסיף "מלחמה"
            // בינתיים כל שחקן שומר את הקלף שלו
            p1.pile.push(card1);
            p2.pile.push(card2);
        }

        this.checkGameOver();

        return this.getState();
    }

    endGame(): ClientGameState {
        this.gameOver = true;
        return this.getState();
    }

    getState(forPlayerId?: string): ClientGameState {
        return {
            players: this.players.map(p => this.mapToClientPlayerState(p, forPlayerId)),
            currentPlayerIndex: this.currentPlayerIndex,
            gameOver: this.gameOver,
            winner: this.getWinner(),
            round: this.turnHistory.length,
            potSize: this.players.reduce((acc, p) => acc + p.pile.length, 0),
        };
    }

    private mapToClientPlayerState(p: WarPlayer, viewerId?: string): ClientPlayerState {
        return {
            id: p.id,
            name: p.name,
            handSize: p.hand.length,
            visibleCards: this.getVisibleCards(p, viewerId),
            score: p.pile.length,
        };
    }

    private getVisibleCards(player: WarPlayer, viewerId?: string): ICard[] {
        // אם מדובר בצופה בעצמו – נראה לו את כל הקלפים שלו
        if (player.id === viewerId) {
            return [...player.hand];
        }

        // לשחקנים אחרים – נחשוף רק את הקלף האחרון ששיחקו אם יש
        return player.lastPlayedCard ? [player.lastPlayedCard] : [];
    }

    private checkGameOver() {
        const allCardsExhausted = this.players.some(p => p.hand.length + p.pile.length === 0);
        if (allCardsExhausted) {
            this.gameOver = true;
        }
    }

    private getWinner(): string | undefined {
        if (!this.gameOver) return undefined;
        const [p1, p2] = this.players;
        const total1 = p1.hand.length + p1.pile.length;
        const total2 = p2.hand.length + p2.pile.length;

        if (total1 > total2) return p1.id;
        if (total2 > total1) return p2.id;
        return undefined;
    }
}
