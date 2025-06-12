// src/pages/LobbyPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";
import { PlayerState } from "../types/player";
import PlayerList from "../components/PlayerList";
import { GameType } from "../types/game";
import { useAuth } from "../context/AuthContext";
import { usePlayerName } from "../context/PlayerNameContext";

const GAME_TYPE_DISPLAY: Record<GameType, { name: string; icon: string }> = {
  [GameType.WAR]: { name: "מלחמה", icon: "⚔️" },
  [GameType.DURAK]: { name: "דוראק", icon: "🃏" },
};

const MAX_PLAYERS = 4;

export default function LobbyPage() {
  const { id, type } = useParams<{ id: string; type: GameType }>();
  const navigate = useNavigate();

  /* מקור יחיד לשם-שחקן */
  const { user } = useAuth();
  const pnCtx = usePlayerName();
  const playerName =
    user?.displayName ||
    pnCtx.playerName ||
    localStorage.getItem("playerName") ||
    `שחקן${Math.floor(Math.random() * 1000)}`;

  const [players, setPlayers] = useState<PlayerState[]>([]);

  useEffect(() => {
    if (!id || !type) return;

    const socket = socketManager.connect();
    const onConnect = () => {
      socket.emit('join-room', { roomId: id, playerName });
    };


    if (socket.connected) onConnect();
    else socket.once('connect', onConnect);

    const goToGame = () => navigate(`/game/${type}/${id}`);
    socket.on('game-started', goToGame);

    return () => {
      socket.off('connect', onConnect);
      socket.off('game-started', goToGame);
      socketManager.disconnect();
    };
  }, [id, type, playerName, navigate]);

  useSocket("player-list", setPlayers);

  if (!id || !type) return <div>Invalid room</div>;

  const disp = GAME_TYPE_DISPLAY[type];

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <span>{disp.icon}</span><span>{disp.name}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          חדר <b>{id}</b> • {players.length}/{MAX_PLAYERS} שחקנים
        </div>
      </div>

      <PlayerList players={players} />

      <button
        className="bg-blue-500 text-white px-8 py-2 rounded-xl text-lg mt-6 shadow hover:bg-blue-700"
        onClick={() => socketManager.emit("start-game", id)}
        disabled={players.length < 2}
      >
        התחל משחק
      </button>

      {players.length < 2 &&
        <div className="text-gray-400 text-sm mt-2">
          יש צורך בלפחות שני שחקנים כדי להתחיל
        </div>}
    </div>
  );
}
