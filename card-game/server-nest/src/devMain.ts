import { Player } from './entities/Player';
import { DurakGame } from './games/durak/DurakGame';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const players = [
    new Player('Alice'),
    new Player('Bob'),
    new Player('Charlie'),
  ];

  const game = new DurakGame(players);

  console.log('\n🎴 Welcome to Durak Game 🎴');
  console.log('------------------------------');

  game.startGame();

  let turnCount = 0;
  while (!game.isGameOver() && turnCount < 10) {
    game.startRound();

    console.log('\n📌 Starting round state:');
    const state = game.getState();
    console.log(`🃏 Trump: ${state.trump}`);
    state.players.forEach(p => {
      console.log(`👤 ${p.name} holds ${p.handSize} cards`);
      const fullPlayer = players.find(pl => pl.id === p.id);
      if (fullPlayer) {
        console.log(`   🖐️ Hand: ${fullPlayer.hand.map(card => card.toString()).join(', ')}`);
      }
    });

    const attacker = players[game['attackerIndex']];
    const defender = players[game['defenderIndex']];

    const firstCard = attacker.hand.find(card => {
      const allowedValues = game['getAllowedAttackValues']();
      return game['table'].length === 0 || allowedValues.includes(card.value.toString());
    });

    if (!firstCard) {
      console.log(`⚠️ ${attacker.name} has no valid cards to attack`);
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

    console.log('\n🃏 Cards on table:');
    console.log(JSON.stringify(game.getState().table, null, 2));

    const possibleDefend = defender.hand.find(c =>
      game['strategy'].canBeat(firstCard, c)
    );

    if (possibleDefend) {
      console.log(`🛡️ ${defender.name} defends with: ${possibleDefend.toString()}`);
      game.defend(0, possibleDefend);

      // Additional attacks after defense
      const allowedValues = game['getAllowedAttackValues']();
      const tableLimit = Math.min(6, defender.hand.length);
      let attackerIndex = game['attackerIndex'];
      let attackers = [attackerIndex, ...game['getAttackersAfter']()];
      let added = false;

      for (let i = 1; i < tableLimit; i++) {
        for (const attackerId of attackers) {
          const attackerPlayer = players[attackerId];
          const additionalCard = attackerPlayer.hand.find(card => allowedValues.includes(card.value.toString()));
          if (additionalCard) {
            console.log(`➕ ${attackerPlayer.name} adds: ${additionalCard.toString()}`);
            game.attack(attackerId, additionalCard);
            added = true;
            await sleep(150);
            break;
          }
        }
        if (!added) break;
        added = false;
      }

      // Defender tries to defend added attacks
      const table = game.getState().table;
      for (let i = 0; i < table.length; i++) {
        const pair = table[i];
        if (!pair.defender) {
          const nextDefense = defender.hand.find(card =>
            game['strategy'].canBeat(pair.attacker, card)
          );
          if (nextDefense) {
            console.log(`🛡️ ${defender.name} defends with: ${nextDefense.toString()} against ${pair.attacker.value} of ${pair.attacker.suit}`);
            game.defend(i, nextDefense);
          } else {
            console.log(`❌ ${defender.name} can't defend against ${pair.attacker.value} of ${pair.attacker.suit}`);
          }
        }
      }
    } else {
      console.log(`🚫 ${defender.name} could not defend, takes the cards`);
    }

    game.endTurn();

    console.log('\n🔄 State after turn:');
    game.getState().players.forEach(p => {
      console.log(`👤 ${p.name} - ${p.handSize} cards in hand`);
      const fullPlayer = players.find(pl => pl.id === p.id);
      if (fullPlayer) {
        console.log(`   🖐️ Hand: ${fullPlayer.hand.map(card => card.toString()).join(', ')}`);
      }
    });
    console.log(`🃏 Cards left in deck: ${game.getState().deckSize}`);

    turnCount++;
  }

  game.endGame();
}

main();
