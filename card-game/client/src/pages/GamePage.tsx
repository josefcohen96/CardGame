import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";
import { GameState } from "../types/game";
import WarGameBoard from "../games/war/WarGameBoard";
import DurakGameBoard from "../games/durak/DurakGameBoard";
import { GameType } from "../types/game";

export default function GamePage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!id || !type) return;
    socketManager.connect();
    socketManager.emit("join-game", { roomId: id, playerName: name });
    return () => {
      socketManager.disconnect();
    };
  }, [id, type, name]);

  useSocket("game-state", (state: GameState) => {
    console.log("[Client] Received game-state:", state);
    console.log("gameState", state.piles,);
    setGameState(state);
  });

  if (!id || !type) return <div className="text-center mt-8 text-red-600">❌ כתובת משחק שגויה</div>;
  if (!gameState) return <div className="text-center mt-8">🔄 טוען משחק...</div>;

  switch (type) {
    case GameType.WAR:
      return <WarGameBoard gameState={gameState} />;
    case GameType.DURAK:
      // return <DurakGameBoard gameState={gameState} />;
      return <div className="text-center mt-8 text-red-600">🃏 דוראק עדיין בפיתוח</div>;
    default:
      return <div className="text-center mt-8 text-red-600">❓ סוג משחק לא נתמך</div>;
  }
}