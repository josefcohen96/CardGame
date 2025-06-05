import React from 'react';
import { Card as CardType } from '../games/gameInterfaces';

const Card = ({ card }: { card: CardType }) => {
  return (
    <div style={{ border: '1px solid #333', padding: '1rem', borderRadius: '8px', margin: '0.5rem', backgroundColor: card.color }}>
      <div>{card.value}</div>
      <div>{card.suit}</div>
    </div>
  );
};

export default Card;