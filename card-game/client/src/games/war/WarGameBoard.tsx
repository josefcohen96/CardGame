import { WarGameState } from "./types";
import GameLayout from "../../components/shared/GameLayout";


function handlePlay() {
  // לוגיקה לשחק תור במלחמה
  console.log("Playing turn in War game");

  
}

export default function WarGameBoard({ gameState }: { gameState: WarGameState }) {
  return (
    <GameLayout
      gameState={gameState}
      renderActions={
        <button onClick={handlePlay}>שחק תור</button>
      }
    />
  );
}