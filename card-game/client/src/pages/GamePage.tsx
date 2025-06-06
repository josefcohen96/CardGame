import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";
import type { GameState } from "../types/game";
import WarGameBoard from "../games/war/WarGameBoard";
import DurakGameBoard from "../games/durak/DurakGameBoard";
import { GameType } from "../types/game";


export default function GamePage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const [gameState, setGameState] = useState<GameState | null>(null);

  // התחברות לחדר
  useEffect(() => {
    if (!id || !type) return;
    socketManager.connect();
    socketManager.emit("join-game", id, name);

    return () => {
      socketManager.disconnect();
    };
  }, [id, type, name]);

  // האזנה לעדכוני סטייט מהשרת
  useSocket("game-state", (state) => setGameState(state));

  if (!id || !type) return <div>Invalid game</div>;
  if (!gameState) return <div className="text-center mt-8">טוען משחק...</div>;

  if (type === GameType.WAR) return <WarGameBoard gameState={gameState as any} />;
  if (type === GameType.DURAK) return <DurakGameBoard gameState={gameState as any} />;

  return <div className="text-center mt-8">Unknown game type</div>;
}
