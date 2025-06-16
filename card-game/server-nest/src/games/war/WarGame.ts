// games/war/WarGame.ts
import { CardGame } from '../core/CardGame';
import { IPlayer, GameType } from '../../interfaces';
import { WarDeckFactory } from './WarDeckFactory';
import { WarPot } from './WarPot';
import { WarCardValueStrategy } from './WarCardValueStrategy';
import { ClientGameState } from '../../interfaces/game/client-game-state.interface';
import { GameFactory } from '../factories/game.factory';

export class WarGame extends CardGame {
    private readonly cardValueStrategy: WarCardValueStrategy;
    private round = 0;

    constructor(players: IPlayer[]) {
        super(GameType.WAR, WarDeckFactory.createDeck(), players);
        this.pot = new WarPot();
        this.cardValueStrategy = new WarCardValueStrategy();
        this.dealCardsEvenly();
    }

    private dealCardsEvenly(): void {
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

    startGame(): ClientGameState {
        this.round = 1;
        return this.getState();
    }

    playTurn(_playerId: string, _move: any): ClientGameState {
        if (this.gameOver) return this.getState();

        this.round++;

        const played = this.players.map(player => ({
            player,
            card: player.playTopCard(),
        })).filter(entry => entry.card);

        for (const { card } of played) {
            this.pot.add(card!);
        }

        if (played.length === 0) {
            return this.endGame();
        }

        const maxVal = Math.max(...played.map(p => this.cardValueStrategy.getCardValue(p.card!)));
        const winners = played.filter(p => this.cardValueStrategy.getCardValue(p.card!) === maxVal);

        if (winners.length === 1) {
            winners[0].player.receiveCards(this.pot.takeAll());
        }

        const activePlayers = this.players.filter(p => p.hand.length > 0);
        if (activePlayers.length <= 1) {
            return this.endGame();
        }

        return this.getState();
    }

    endGame(): ClientGameState {
        this.gameOver = true;
        return this.getState();
    }

    getState(): ClientGameState {
        const players = this.players.map(p => ({
            id: p.id,
            name: p.name,
            handSize: p.hand.length,
            score: 0,
        }));

        const piles = Object.fromEntries(
            this.players.map(p => [p.id, p.pile || []])
        );

        return {
            players,
            currentPlayerIndex: this.currentPlayerIndex,
            gameOver: this.gameOver,
            winner: undefined,
            piles,
            round: this.round,
            potSize: this.pot.getSize?.() || 0,
        };
    }
}

GameFactory.register(GameType.WAR, WarGame);
