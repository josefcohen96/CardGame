import React from 'react';
import { GameState } from '../../types/game';
import PlayerZone from './PlayerZone';
import GameBoard from './GameBoard';

interface Props {
  gameState: GameState;
  renderBoard?: React.ReactNode;
  renderActions?: React.ReactNode;
}

const GameLayout: React.FC<Props> = ({ gameState, renderBoard, renderActions }) => {
  const { players, currentPlayerIndex, sharedPile, board, piles, gameOver, winner } = gameState;

  return (
    <div className="p-4 flex flex-col gap-6 items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {players.map((player, idx) => (
          <PlayerZone
            key={player.id}
            player={player}
            isCurrent={idx === currentPlayerIndex}
            pile={piles?.[player.id]}
          />
        ))}
      </div>

      {renderBoard || (
        <>
          {sharedPile && <GameBoard pile={sharedPile} />}
          {board && <GameBoard pile={board} />}
        </>
      )}

      {renderActions && <div className="mt-4">{renderActions}</div>}

      {gameOver && (
        <div className="mt-6 text-2xl font-bold text-green-600">
          🎉 המשחק נגמר. המנצח: {winner}
        </div>
      )}
    </div>
  );
};

export default GameLayout;
