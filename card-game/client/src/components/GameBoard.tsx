import React from 'react';
import PlayerHand from './PlayerHand';
import { GameState } from '../games/gameInterfaces';

const GameBoard = ({ state }: { state: GameState }) => {
  return (
    <div>
      {state.players.map((p, i) => (
        <PlayerHand key={i} player={p} isCurrent={i === state.currentPlayerIndex} />
      ))}
      {state.pile && (
        <div>
          <h4>🃏 Pile</h4>
          <div style={{ display: 'flex' }}>
            {state.pile.map((card, idx) => (
              <div key={idx}>{card.value} {card.suit}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;