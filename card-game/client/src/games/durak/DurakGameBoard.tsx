import { DurakGameState } from "./types";
import GameBoard from "../../components/shared/GameBoard";
import PlayerList from "../../components/PlayerList";

export default function WarGameBoard({ gameState }: { gameState: DurakGameState }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <PlayerList players={gameState.players} />
      <GameBoard pile={gameState.pile ?? []} />
    </div>
  );
}
