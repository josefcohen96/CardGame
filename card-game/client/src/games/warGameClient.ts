import { Card, GameClient, GameState } from './gameInterfaces';

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const colorMap: Record<string, string> = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };

function createDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      cards.push({ suit, value, color: colorMap[suit] });
    }
  }
  return cards.sort(() => Math.random() - 0.5);
}

let players = [
  { name: 'Alice', hand: [] as Card[] },
  { name: 'Bob', hand: [] as Card[] },
];

let pile: Card[] = [];
let currentPlayerIndex = 0;
let gameOver = false;

const warGameClient: GameClient = {
  name: 'War',
  startGame() {
    const deck = createDeck();
    players[0].hand = deck.filter((_, i) => i % 2 === 0);
    players[1].hand = deck.filter((_, i) => i % 2 === 1);
    pile = [];
    gameOver = false;
    currentPlayerIndex = 0;
  },
  playTurn() {
    if (gameOver) return;
    const card1 = players[0].hand.shift();
    const card2 = players[1].hand.shift();
    if (card1 && card2) {
      pile = [card1, card2];
      const getVal = (card: Card) => {
        if (card.value === 'A') return 14;
        if (card.value === 'K') return 13;
        if (card.value === 'Q') return 12;
        if (card.value === 'J') return 11;
        return parseInt(card.value);
      };
      const winner = getVal(card1) > getVal(card2) ? players[0] : players[1];
      winner.hand.push(...pile);
    }
    if (players[0].hand.length === 0 || players[1].hand.length === 0) {
      gameOver = true;
    }
  },
  getGameState(): GameState {
    return {
      players: players.map(p => ({
        name: p.name,
        handSize: p.hand.length,
        visibleCards: [],
      })),
      currentPlayerIndex,
      pile,
      gameOver,
      winner: gameOver
        ? players[0].hand.length > players[1].hand.length
          ? players[0].name
          : players[1].name
        : undefined,
    };
  },
};

export { warGameClient };