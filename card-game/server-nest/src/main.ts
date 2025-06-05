import { Player } from './entities/Player';
import { WarCardValueStrategy } from './games/war/WarCardValueStrategy';
import { WarGame } from './games/war/WarGame';
import { WarDeckFactory } from './games/war/WarDeckFactory';
import { DurakGame } from './games/durak/DurakGame';

const players = [
  new Player('Alice'),
  new Player('Bob'),
  new Player('Charlie'),
];

// Create Durak game
const game = new DurakGame(players);

console.log('\n🎴 Welcome to Durak Game 🎴');
console.log('------------------------------');

game.startGame();

while (!game.isGameOver()) {
  game.startRound();

  // Print initial round state
  console.log('\n📌 Starting round state:');
  const state = game.getState();
  console.log(`🃏 Trump: ${state.trump}`);
  state.players.forEach(p =>
    console.log(`👤 ${p.name} holds ${p.handSize} cards`)
  );

  const attacker = players[game['attackerIndex']];
  const defender = players[game['defenderIndex']];
  const firstCard = attacker.hand[0];

  if (!firstCard) {
    console.log(`⚠️ ${attacker.name} has no cards to attack`);
    game.endTurn();
    continue;
  }

  console.log(`\n⚔️ ${attacker.name} attacks with: ${firstCard.toString()}`);
  const attackSuccess = game.attack(game['attackerIndex'], firstCard);

  if (!attackSuccess) {
    console.log(`🚫 Attack failed`);
    game.endTurn();
    continue;
  }

  // Print table state after attack
  console.log('\n🃏 Cards on table:');
  console.log(JSON.stringify(game.getState().table, null, 2));

  const possibleDefend = defender.hand.find(c =>
    game['strategy'].canBeat(firstCard, c)
  );

  if (possibleDefend) {
    console.log(`🛡️ ${defender.name} defends with: ${possibleDefend.toString()}`);
    game.defend(0, possibleDefend);
  } else {
    console.log(`🚫 ${defender.name} could not defend, takes the cards`);
  }

  // End turn
  game.endTurn();

  // Print state after turn
  console.log('\n🔄 State after turn:');
  game.getState().players.forEach(p =>
    console.log(`👤 ${p.name} - ${p.handSize} cards in hand`)
  );
  console.log(`🃏 Cards left in deck: ${game.getState().deckSize}`);
}

game.endGame();
