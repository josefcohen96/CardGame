import React from 'react';
import Card from './Card';
import { PlayerState } from '../games/gameInterfaces';

const PlayerHand = ({ player, isCurrent }: { player: PlayerState; isCurrent: boolean }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>{isCurrent ? '👉 ' : ''}{player.name}</strong> – {player.handSize} cards
      <div style={{ display: 'flex' }}>
        {(player.visibleCards || []).map((card, idx) => (
          <Card key={idx} card={card} />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;