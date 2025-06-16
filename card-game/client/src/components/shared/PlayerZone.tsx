import React from 'react';
import { PlayerState } from "../../types/game";
import CardDisplay from './CardDisplay';
import { Card } from '../../types/card';

interface Props {
  player: PlayerState;
  isCurrent: boolean;
  pile?: Card[];
}

const PlayerZone: React.FC<Props> = ({ player, isCurrent, pile }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col items-start gap-2">
      <div className={`font-bold ${isCurrent ? 'text-blue-600' : ''}`}>
        {isCurrent ? '👉 ' : ''}{player.name}
      </div>

      <div className="text-sm text-gray-500">🃏 ביד: {player.handSize}</div>

      {player.visibleCards && player.visibleCards.length > 0 && (
        <div className="flex gap-1">
          {player.visibleCards.map((card, i) => (
            <CardDisplay key={i} card={card} />
          ))}
        </div>
      )}

      {player.faceUpCards && player.faceUpCards.length > 0 && (
        <div className="flex gap-1">
          {player.faceUpCards.map((card, i) => (
            <CardDisplay key={i} card={card} />
          ))}
        </div>
      )}

      {player.faceDownCardsCount && (
        <div className="text-xs text-gray-400">
          קלפים מוסתרים: {player.faceDownCardsCount}
        </div>
      )}

      {pile && pile.length > 0 && (
        <div className="flex gap-1 mt-1">
          <span className="text-sm">ערימה:</span>
          {pile.map((card, i) => (
            <CardDisplay key={i} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerZone;
