import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";
import { PlayerState } from "../types/player";
import PlayerList from "../components/PlayerList";

export default function LobbyPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const navigate = useNavigate();
  const rooms = new Map();

  useEffect(() => {
    if (!id || !type) return;
    socketManager.connect();
    socketManager.emit("join-game", id, name);

    const handleGameStarted = () => navigate(`/game/${type}/${id}?name=${name}`);
    socketManager.on("game-started", handleGameStarted);

    return () => {
      socketManager.off("game-started", handleGameStarted);
      socketManager.disconnect();
    };
  }, [id, type, name, navigate]);

  useSocket("player-list", setPlayers);

  if (!id || !type) return <div>Invalid room</div>;

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      <h2 className="text-xl font-bold">
        חדר: {id} ({type})
      </h2>
      <PlayerList players={players} />
      <button
        className="bg-blue-500 text-white px-8 py-2 rounded-xl text-lg mt-6 shadow hover:bg-blue-700"
        onClick={() => socketManager.emit("start-game", id)}
        disabled={players.length < 2}
      >
        התחל משחק
      </button>
      {players.length < 2 && (
        <div className="text-gray-400 text-sm mt-2">
          יש צורך בלפחות שני שחקנים
        </div>
      )}
    </div>
  );
}
