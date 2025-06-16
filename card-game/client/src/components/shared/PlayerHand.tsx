import React from 'react';
import CardDisplay from './CardDisplay';
import { PlayerState } from '../../games/gameInterfaces';

const PlayerHand = ({ player, isCurrent }: { player: PlayerState; isCurrent: boolean }) => {
  const cardsToDisplay = player.visibleCards?.length
    ? player.visibleCards.map((c, i) => <CardDisplay key={i} card={c} />)
    : Array.from({ length: player.handSize }, (_, i) => <CardDisplay key={i} card={{ suit: '', value: '', color: '' }} hidden />);

  return (
    <div className="mb-4 w-full">
      <div className={`font-bold ${isCurrent ? 'text-blue-600' : ''}`}>{isCurrent ? '👉 ' : ''}{player.name}</div>
      <div className="flex gap-1 mt-1">{cardsToDisplay}</div>
    </div>
  );
};

export default PlayerHand;