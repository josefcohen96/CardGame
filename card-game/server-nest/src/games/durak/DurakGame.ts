// import { IPlayer, ICard, GameState } from '../../interfaces/Interfaces';
// import { Suit } from '../../interfaces/Suits';
// import { CardGame } from '../../core/CardGame';
// import { DurakPot } from './DurakPot';
// import { DurakCardValueStrategy } from './DurakCardValueStrategy';
// import { DurakDeckFactory } from './DurakDeckFactory';

// export class DurakGame extends CardGame {
//   protected pot: DurakPot;
//   private table: { attacker: ICard; defender?: ICard }[] = [];
//   private attackerIndex: number = 0;
//   private defenderIndex: number = 1;
//   private currentTrump: Suit;
//   private strategy: DurakCardValueStrategy;
//   private activeAttackers: Set<number> = new Set();
//   private outPlayers: Set<number> = new Set();

//   constructor(players: IPlayer[]) {
//     const deck = DurakDeckFactory.createDeck();
//     super(deck, players);
//     this.pot = new DurakPot();
//     const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
//     this.currentTrump = suits[Math.floor(Math.random() * suits.length)];
//     this.strategy = new DurakCardValueStrategy(this.currentTrump);
//     this.setup();
//   }

//   private setup(): void {
//     this.deck.shuffle();
//     for (let i = 0; i < 6; i++) {
//       this.players.forEach(player => {
//         const card = this.deck.draw();
//         if (card) player.receiveCard(card);
//       });
//     }
//   }

//   private getNextActivePlayer(fromIndex: number): number {
//     let index = (fromIndex + 1) % this.players.length;
//     while (this.outPlayers.has(index)) {
//       index = (index + 1) % this.players.length;
//       if (index === fromIndex) {
//         return -1; // no active players left
//       }
//     }
//     return index;
//   }

//   private getAttackersAfter(): number[] {
//     const attackers: number[] = [];
//     let nextAttacker = this.getNextActivePlayer(this.attackerIndex);
//     if (nextAttacker === -1) {
//       this.isGameOver();
//     }
//     while (nextAttacker !== this.defenderIndex) {
//       if (!this.outPlayers.has(nextAttacker)) attackers.push(nextAttacker);
//       nextAttacker = (nextAttacker + 1) % this.players.length;
//     }
//     return attackers;
//   }

//   private refillHands(): void {
//     const drawOrder = [this.attackerIndex, ...this.getAttackersAfter(), this.defenderIndex];
//     for (const idx of drawOrder) {
//       const player = this.players[idx];
//       if (this.outPlayers.has(idx)) continue;
//       while (player.hand.length < 6 && !this.deck.isEmpty()) {
//         const card = this.deck.draw();
//         if (card) player.receiveCard(card);
//       }
//       if (player.hand.length === 0 && this.deck.isEmpty()) {
//         console.log(`${player.name} has finished the game!`);
//         this.outPlayers.add(idx);
//       }
//     }
//   }

//   private getAllowedAttackValues(): string[] {
//     const values = new Set<string>();
//     for (const pair of this.table) {
//       values.add(pair.attacker.value.toString());
//       if (pair.defender) {
//         values.add(pair.defender.value.toString());
//       }
//     }
//     return Array.from(values);
//   }

//   private canAddMoreAttacks(): boolean {
//     return this.table.length < Math.min(6, this.players[this.defenderIndex].hand.length);
//   }

//   public startGame(): GameState {
//     this.startRound();
//     return {
//       gameId: '', // This will be set by the GameService
//       players: this.players,
//       deck: this.deck,
//       pot: this.pot,
//       currentPlayerIndex: this.attackerIndex,
//       turnHistory: [],
//       gameOver: this.isGameOver(),
//     }
//   }

//   public startRound(): void {
//     this.table = [];
//     this.activeAttackers.clear();
//     this.activeAttackers.add(this.attackerIndex);
//     console.log(`Attacker is ${this.players[this.attackerIndex].name}`);
//     console.log(`Defender is ${this.players[this.defenderIndex].name}`);
//   }

//   public playTurn(playerId: string, move: any): GameState {
//     const playerIndex = this.players.findIndex(p => p.id === playerId);
//     if (playerIndex === -1 || this.outPlayers.has(playerIndex)) {
//       throw new Error('Invalid player or player is out of the game');
//     }
//     if (this.attackerIndex !== playerIndex && this.defenderIndex !== playerIndex) {
//       throw new Error('It is not your turn');
//     }
//     if (this.isGameOver()) {
//       throw new Error('Game is already over');
//     }
//     if (this.attackerIndex === playerIndex) {
//       if (!this.activeAttackers.has(playerIndex)) {
//         throw new Error('You are not allowed to attack');
//       }
//       if (move.type === 'attack') {
//         const card = move.card as ICard;
//         if (!this.attack(playerIndex, card)) {
//           throw new Error('Invalid attack');
//         }
//       } else if (move.type === 'addAttackCard') {
//         const card = move.card as ICard;
//         if (!this.addAttackCard(playerIndex, card)) {
//           throw new Error('Invalid add attack card');
//         }
//       } else {
//         throw new Error('Invalid move type');
//       }
//     } else if (this.defenderIndex === playerIndex) {
//       const { attackIndex, card } = move;
//       if (typeof attackIndex !== 'number' || !card) {
//         throw new Error('Invalid defend move');
//       }
//       if (!this.defend(attackIndex, card)) {
//         throw new Error('Defend failed');
//       }
//     } else {
//       throw new Error('Not your turn');
//     }

//     return this.getState();
//   }

//   public attack(playerIndex: number, card: ICard): boolean {
//     if (!this.activeAttackers.has(playerIndex)) return false;
//     if (!this.canAddMoreAttacks()) return false;

//     const player = this.players[playerIndex];
//     if (!player.hand.includes(card)) return false;

//     if (this.table.length > 0) {
//       const allowedValues = this.getAllowedAttackValues();
//       if (!allowedValues.includes(card.value.toString())) return false;
//     }

//     this.table.push({ attacker: card });
//     player.playCardByIndex(player.hand.indexOf(card));
//     return true;
//   }

//   public addAttackCard(playerIndex: number, card: ICard): boolean {
//     return this.attack(playerIndex, card);
//   }

//   public allowAdditionalAttacker(playerIndex: number): void {
//     if ((playerIndex + this.players.length) % this.players.length === (this.attackerIndex + 1) % this.players.length) {
//       this.activeAttackers.add(playerIndex);
//     }
//   }

//   public defend(attackIndex: number, card: ICard): boolean {
//     const defender = this.players[this.defenderIndex];
//     const target = this.table[attackIndex];
//     if (!target || target.defender) return false;
//     if (!defender.hand.includes(card)) return false;
//     if (this.strategy.canBeat(target.attacker, card)) {
//       target.defender = card;
//       defender.playCardByIndex(defender.hand.indexOf(card));
//       return true;
//     }
//     return false;
//   }

//   public endTurn(): void {
//     const defenderSucceeded = this.table.every(pair => pair.defender);
//     const defender = this.players[this.defenderIndex];
//     if (defenderSucceeded) {
//       this.table.forEach(pair => {
//         if (pair.attacker) this.pot.add(pair.attacker);
//         if (pair.defender) this.pot.add(pair.defender);
//       });
//       this.pot.takeAll();
//     } else {
//       this.table.forEach(pair => {
//         if (pair.attacker) defender.receiveCard(pair.attacker);
//         if (pair.defender) defender.receiveCard(pair.defender);
//       });
//     }
//     this.refillHands();
//     const nextAttacker = this.getNextActivePlayer(this.defenderIndex);
//     if (nextAttacker === -1) {
//       this.endGame();
//       return;
//     }

//     const nextDefender = this.getNextActivePlayer(nextAttacker);
//     if (nextDefender === -1) {
//       this.endGame();
//       return;
//     }

//     this.attackerIndex = nextAttacker;
//     this.defenderIndex = nextDefender;

//   }

//   public endGame(): GameState {
//     const winner = this.getWinner();
//     if (winner) {
//       console.log(`Game over! Winner: ${winner}`);
//     } else {
//       console.log('Game over! No winner.');
//     }
//     return {
//       gameId: '', // This will be set by the GameService
//       players: this.players,
//       deck: this.deck,
//       pot: this.pot,
//       currentPlayerIndex: this.attackerIndex,
//       turnHistory: [],
//       gameOver: true,
//     }
//   }

//   public isGameOver(): boolean {
//     const activePlayers = this.players.filter((_, i) => !this.outPlayers.has(i));
//     return activePlayers.length <= 1;
//   }

//   public getWinner(): string | null {
//     const remaining = this.players.filter((_, i) => !this.outPlayers.has(i));
//     return remaining.length === 1 ? remaining[0].name : null;
//   }

//   public getState(): any {
//     return {
//       trump: this.strategy.getTrump(),
//       players: this.players.map((p, i) => ({
//         id: p.id,
//         name: p.name,
//         handSize: p.hand.length,
//         isOut: this.outPlayers.has(i)
//       })),
//       table: this.table,
//       deckSize: this.deck.getLength()
//     };
//   }

//   public addPlayer(player: IPlayer): boolean {
//     if (this.players.length >= 6) return false;
//     this.players.push(player);
//     return true;
//   }
// }
