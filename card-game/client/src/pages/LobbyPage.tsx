import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";
import { PlayerState } from "../types/player";
import PlayerList from "../components/PlayerList";
import { GameType } from "../types/game";

const GAME_TYPE_DISPLAY: Record<GameType, { name: string; icon: string }> = {
  [GameType.WAR]: { name: "מלחמה", icon: "⚔️" },
  [GameType.DURAK]: { name: "דוראק", icon: "🃏" },
};

const MAX_PLAYERS = 4;

export default function LobbyPage() {
  const { id, type } = useParams<{ id: string; type: GameType }>();
  const [searchParams] = useSearchParams();
  const name =
    searchParams.get("playerName") ||
    localStorage.getItem("playerName") ||
    `שחקן${Math.floor(Math.random() * 1000)}`;
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const navigate = useNavigate();

  // התחברות ושמירה של השחקן בלוקאל
  useEffect(() => {
    if (name) {
      localStorage.setItem("playerName", name);
    }
  }, [name]);

  useEffect(() => {
    if (!id || !type) return;
    socketManager.connect();
    // לשלוח בפורמט הנכון (בהתאם ל-interface)
    socketManager.emit("join-room", { roomId: id, playerName: name });

    const handleGameStarted = () =>
      navigate(`/game/${type}/${id}?name=${encodeURIComponent(name)}`);
    socketManager.on("game-started", handleGameStarted);

    return () => {
      socketManager.off("game-started", handleGameStarted);
      socketManager.disconnect();
    };
  }, [id, type, name, navigate]);

  // קבלת רשימת שחקנים
  useSocket("player-list", setPlayers);

  if (!id || !type) return <div>Invalid room</div>;

  const gameTypeDisplay =
    GAME_TYPE_DISPLAY[type as GameType] || { name: type, icon: "🎮" };

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      {/* כותרת לובי */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <span>{gameTypeDisplay.icon}</span>
          <span>{gameTypeDisplay.name}</span>
        </div>
        <div className="mt-2 text-base text-gray-700">
          חדר: <span className="font-semibold">{id}</span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          נמצאים {players.length} מתוך {MAX_PLAYERS} שחקנים
        </div>
      </div>
      {/* רשימת שחקנים */}
      <PlayerList players={players} />
      {/* כפתור התחל משחק */}
      <button
        className="bg-blue-500 text-white px-8 py-2 rounded-xl text-lg mt-6 shadow hover:bg-blue-700"
        onClick={() => socketManager.emit("start-game", id)}
        disabled={players.length < 2}
      >
        התחל משחק
      </button>
      {players.length < 2 && (
        <div className="text-gray-400 text-sm mt-2">
          יש צורך בלפחות שני שחקנים כדי להתחיל
        </div>
      )}
    </div>
  );
}