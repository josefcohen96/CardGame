import { IPlayer, ICard, IDeck, IGame } from '../../interfaces/Interfaces';
import { Deck } from '../../entities/Deck';
import { DurakPot } from './DurakPot';
import { DurakCardValueStrategy } from './DurakCardValueStrategy';
import { DurakDeckFactory } from './DurakDeckFactory';
import { Suit } from '../../interfaces/Suits';
import { CardGame } from '../../core/CardGame';

export class DurakGame extends CardGame {
  private pot: DurakPot;
  private table: { attacker: ICard; defender?: ICard }[] = [];
  private attackerIndex: number = 0;
  private defenderIndex: number = 1;
  private currentTrump: Suit;
  private strategy: DurakCardValueStrategy;
  private activeAttackers: Set<number> = new Set();

  constructor(players: IPlayer[]) {
    const deck = DurakDeckFactory.createDeck();
    super(deck, players);
    this.pot = new DurakPot();
    const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
    this.currentTrump = suits[Math.floor(Math.random() * suits.length)];
    this.strategy = new DurakCardValueStrategy(this.currentTrump);
    this.setup();
  }

  private setup(): void {
    this.deck.shuffle();
    for (let i = 0; i < 6; i++) {
      this.players.forEach(player => {
        const card = this.deck.draw();
        if (card) player.receiveCard(card);
      });
    }
  }

  private refillHands(): void {
    const drawOrder = [this.attackerIndex, ...this.getAttackersAfter(), this.defenderIndex];
    for (const idx of drawOrder) {
      const player = this.players[idx];
      while (player.hand.length < 6 && !this.deck.isEmpty()) {
        const card = this.deck.draw();
        if (card) player.receiveCard(card);
      }
    }
  }

  private getAttackersAfter(): number[] {
    const attackers: number[] = [];
    for (let i = 1; i < this.players.length - 1; i++) {
      const idx = (this.attackerIndex + i) % this.players.length;
      if (idx !== this.defenderIndex) attackers.push(idx);
    }
    return attackers;
  }

  public startGame(): void {
    // additional logic on full start can go here
  }

  public startRound(): void {
    this.table = [];
    this.activeAttackers.clear();
    this.activeAttackers.add(this.attackerIndex);
    console.log(`Attacker is ${this.players[this.attackerIndex].name}`);
    console.log(`Defender is ${this.players[this.defenderIndex].name}`);
  }

  public playTurn(player: IPlayer): void {
    // optional implementation depending on interactive game
  }

  public attack(playerIndex: number, card: ICard): boolean {
    if (!this.activeAttackers.has(playerIndex)) return false;
    const player = this.players[playerIndex];
    if (!player.hand.includes(card)) return false;

    const isValid = this.table.length === 0 ||
      this.table.some(pair =>
        pair.attacker.value === card.value ||
        pair.defender?.value === card.value
      );

    if (isValid) {
      this.table.push({ attacker: card });
      player.playCardByIndex(player.hand.indexOf(card));
      return true;
    }
    return false;
  }

  public allowAdditionalAttacker(playerIndex: number): void {
    if ((playerIndex + this.players.length) % this.players.length === (this.attackerIndex + 1) % this.players.length) {
      this.activeAttackers.add(playerIndex);
    }
  }

  public defend(attackIndex: number, card: ICard): boolean {
    const defender = this.players[this.defenderIndex];
    const target = this.table[attackIndex];
    if (!target || target.defender) return false;
    if (!defender.hand.includes(card)) return false;

    if (this.strategy.canBeat(target.attacker, card)) {
      target.defender = card;
      defender.playCardByIndex(defender.hand.indexOf(card));
      return true;
    }
    return false;
  }

  public endTurn(): void {
    const defenderSucceeded = this.table.every(pair => pair.defender);
    const defender = this.players[this.defenderIndex];
    if (defenderSucceeded) {
      this.table.forEach(pair => {
        if (pair.attacker) this.pot.add(pair.attacker);
        if (pair.defender) this.pot.add(pair.defender);
      });
      this.pot.takeAll();
    } else {
      this.table.forEach(pair => {
        if (pair.attacker) defender.receiveCard(pair.attacker);
        if (pair.defender) defender.receiveCard(pair.defender);
      });
    }
    this.refillHands();
    if (defenderSucceeded) {
      this.attackerIndex = this.defenderIndex;
    }
    this.defenderIndex = (this.defenderIndex + 1) % this.players.length;
  }

  public endGame(): void {
    const winner = this.getWinner();
    if (winner) {
      console.log(`\n🏆 Game over! The winner is: ${winner}`);
    } else {
      console.log('\n🤝 The game ended in a draw or everyone ran out of cards!');
    }
  }

  public isGameOver(): boolean {
    return this.players.filter(p => p.hand.length > 0).length <= 1;
  }

  public getWinner(): string | null {
    const remaining = this.players.filter(p => p.hand.length > 0);
    return remaining.length === 1 ? remaining[0].name : null;
  }

  public getState(): any {
    return {
      trump: this.strategy.getTrump(),
      players: this.players.map(p => ({ name: p.name, handSize: p.hand.length })),
      table: this.table,
      deckSize: this.deck.getLength()
    };
  }
}