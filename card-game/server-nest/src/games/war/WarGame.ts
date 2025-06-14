// // Path: src/games/war/WARGame.ts
// import { CardGame } from '../../core/CardGame';
// import { IPlayer } from '../../interfaces/Interfaces';
// import { WarDeckFactory } from './WarDeckFactory';
// import { WarPot } from './WarPot';
// import { WarCardValueStrategy } from './WarCardValueStrategy';
// import { ICard } from '../../interfaces/Interfaces';

// export class WarGame extends CardGame {
//   public pot: WarPot;
//   public round: number = 0;
//   private cardValueStrategy: WarCardValueStrategy;

//   constructor(players: IPlayer[]) {
//     super(WarDeckFactory.createDeck(), players); // יצירת הדק מתוך הפקטורי
//     this.pot = new WarPot();
//     this.cardValueStrategy = new WarCardValueStrategy();
//     this.setup();
//   }

//   private setup(): void {
//     this.deck.shuffle();
//     let i = 0;
//     while (this.deck.getLength() > 0) {
//       const card = this.deck.draw();
//       if (card) {
//         this.players[i % this.players.length].receiveCard(card);
//         i++;
//       }
//     }
//   }

//   startGame(): void {
//     this.round = 1;
//     console.log("Game started, players are ready to play!");
//   }

//   playTurn(playerId: string): void {
//     this.round++;
//     const played: { player: IPlayer; card: ICard }[] = [];

//     for (const player of this.players) {
//       const card = player.playTopCard();
//       if (card) {
//         this.pot.add(card);
//         played.push({ player, card });
//         console.log(`${player.name} played: ${card.toString()}`);
//       }
//     }

//     if (played.length === 0) {
//       console.log("No cards were played.");
//       return;
//     }

//     const max = Math.max(...played.map(p => this.cardValueStrategy.getCardValue(p.card)));
//     const winners = played.filter(p => this.cardValueStrategy.getCardValue(p.card) === max);

//     if (winners.length === 1) {
//       winners[0].player.receiveCards(this.pot.takeAll());
//       console.log(`${winners[0].player.name} won the pot!`);
//     } else {
//       console.log("It's a tie: pot is not distributed this round.");
//     }
//   }

//   getState() {
//     return {
//       round: this.round,
//       players: this.players.map(p => ({
//         name: p.name,
//         handSize: p.hand.length,
//       })),
//       potSize: this.pot.getSize(),
//     };
//   }

//   endGame(): void {
//     const winners = this.players.filter(p => p.hand.length > 0);

//     if (winners.length === 1) {
//       console.log(`The game is over. The winner is ${winners[0].name} with ${winners[0].hand.length} cards!`);
//     } else if (winners.length > 1) {
//       const names = winners.map(w => w.name).join(', ');
//       console.log(`The game ended in a draw: ${names}`);
//     } else {
//       console.log("Game ended: No players left with cards.");
//     }
//   }
// }
