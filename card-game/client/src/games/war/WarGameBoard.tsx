import { useParams } from "react-router-dom";
import GameLayout from "../../components/shared/GameLayout";
import { GameState } from "../gameInterfaces";
import socketManager from "../../services/socketManager";

export default function WarGameBoard({ gameState }: { gameState: GameState }) {
  const { id } = useParams<{ id: string }>();
  const myPlayerId = socketManager.getSocket().id;

  const handlePlay = () => {
    if (!id || !myPlayerId) return;
    socketManager.emit("game-move", {
      roomId: id,
      playerId: myPlayerId,
      move: {},
    });
  };

  return (
    <GameLayout
      gameState={gameState}
      renderActions={
        <button
          onClick={handlePlay}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          שחק תור
        </button>
      }
    />
  );
}
