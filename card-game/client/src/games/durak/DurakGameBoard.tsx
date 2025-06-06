import React from "react";
import { DurakGameState } from "./types";
import GameBoard from "../../components/GameBoard";
import PlayerList from "../../components/PlayerList";

export default function DurakGameBoard({ gameState }: { gameState: DurakGameState }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <PlayerList players={gameState.players} />
      <div className="mt-4">
        <span className="text-xs text-gray-500">Trump Suit: <b>{gameState.trumpSuit}</b></span>
      </div>
      <GameBoard pile={gameState.tableCards ?? []} />
    </div>
  );
}
