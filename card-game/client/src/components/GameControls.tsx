import React from 'react';

const GameControls = ({ onPlayTurn }: { onPlayTurn: () => void }) => {
  return (
    <div>
      <button onClick={onPlayTurn}>Play Turn</button>
    </div>
  );
};

export default GameControls;