// src/games/war/WarPlayer.ts
import { Player } from '../../games/entities/Player';
import { ICard } from '../../interfaces';

export class WarPlayer extends Player {
  hand: ICard[] = [];
  pile: ICard[] = [];
  lastPlayedCard?: ICard;

  constructor(id: string, name: string = '') {
    super(id, name);
  }

  playTopCard(): ICard | undefined {
    if (this.hand.length === 0 && this.pile.length > 0) {
      this.hand = this.pile.splice(0);
      this.shuffleHand();
    }
    return this.hand.shift();
  }

  private shuffleHand() {
    for (let i = this.hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.hand[i], this.hand[j]] = [this.hand[j], this.hand[i]];
    }
  }
}
