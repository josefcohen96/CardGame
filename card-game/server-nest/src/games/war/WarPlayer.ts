// src/games/war/WarPlayer.ts
import { AbstractPlayer } from '../../games/entities/Player';
import { ICard } from '../../interfaces';

export class WarPlayer extends AbstractPlayer {
    playTopCard(): ICard | undefined {
        // אם היד ריקה אך יש pile → טען מחדש
        if (this.hand.length === 0 && this.pile.length > 0) {
            this.hand = this.pile.splice(0);
            this.shuffleHand();
        }
        return this.hand.shift();
    }

    playCardByIndex(i: number): ICard | undefined {
        if (i >= 0 && i < this.hand.length) {
            return this.hand.splice(i, 1)[0];
        }
        return undefined;
    }

    private shuffleHand() {
        for (let i = this.hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.hand[i], this.hand[j]] = [this.hand[j], this.hand[i]];
        }
    }
}
