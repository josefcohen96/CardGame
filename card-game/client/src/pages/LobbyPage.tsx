// src/pages/LobbyPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socketManager from "../services/socketManager";
import { PlayerState } from "../types/player";
import PlayerList from "../components/PlayerList";
import { GameType } from "../types/game";
import { useAuth } from "../context/AuthContext";
import { usePlayerName } from "../context/PlayerNameContext";

/* אייקון / שם־תצוגה למשחק */
const GAME_TYPE_DISPLAY: Record<GameType, { name: string; icon: string }> = {
  [GameType.WAR]: { name: "מלחמה", icon: "⚔️" },
  [GameType.DURAK]: { name: "דוראק", icon: "🃏" },
};

type RoomPayload = {
  id: string;
  type: GameType;
  maxPlayers: number;
  gameStarted: boolean;
  players: PlayerState[];
};

export default function LobbyPage() {
  const { id, type } = useParams<{ id: string; type: GameType }>();
  const navigate = useNavigate();

  /* זהות וכינוי */
  const { user } = useAuth();
  const pnCtx = usePlayerName();
  const playerName =
    user?.displayName ||
    pnCtx.playerName ||
    localStorage.getItem("playerName") ||
    `שחקן${Math.floor(Math.random() * 1000)}`;

  /* מצב החדר שהשרת שולח */
  const [room, setRoom] = useState<RoomPayload | null>(null);
  /* ה-id שלי (socket.id) */
  const [myId, setMyId] = useState<string>("");

  /* ---------- חיבור לחדר ---------- */
  useEffect(() => {
    if (!id || !type) return;

    const socket = socketManager.connect();

    /* אחרי שה-socket מתחבר */
    const onConnect = () => {
      setMyId(socket.id);
      socket.emit("join-room", { roomId: id, playerName, gameType: type });
    };

    if (socket.connected) onConnect();
    else socket.once("connect", onConnect);

    /* מאזינים לשדרוגים מהשרת */
    socket.on("room-update", setRoom);
    socket.on("game-started", () => navigate(`/game/${type}/${id}`));

    /* ניקוי */
    return () => {
      socket.off("connect", onConnect);
      socket.off("room-update", setRoom);
      socket.off("game-started");
      socketManager.disconnect();
    };
  }, [id, type, playerName, navigate]);

  if (!id || !type) return <div>Invalid room</div>;
  if (!room) return <div className="text-center mt-10">טוען…</div>;

  /* נתונים נוחים */
  const disp = GAME_TYPE_DISPLAY[type] ?? { name: type, icon: "🎮" };
  const me = room.players.find(p => p.id === myId);
  const everyoneReady = room.players.length >= 2 && room.players.every(p => p.ready);

  /* ---------- פעולות ---------- */
  const toggleReady = () =>
    socketManager.emit("toggle-ready", { roomId: id, playerId: myId });

  const startGame = () =>
    socketManager.emit("start-game", { roomId: id, playerId: myId });

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      {/* כותרת */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <span>{disp.icon}</span>
          <span>{disp.name}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          חדר <b>{room.id}</b> • {room.players.length}/{room.maxPlayers} שחקנים
        </div>
      </div>

      {/* רשימת שחקנים */}
      <PlayerList players={room.players} />

      {/* כפתור פעולה – תלוי Host/Player */}
      {me?.isHost ? (
        <button
          onClick={startGame}
          disabled={!everyoneReady}
          className="bg-blue-500 text-white px-8 py-2 rounded-xl shadow disabled:opacity-40 mt-6"
        >
          התחל משחק
        </button>
      ) : (
        <button
          onClick={toggleReady}
          className={`px-8 py-2 rounded-xl mt-6 shadow text-white
                     ${me?.ready ? "bg-gray-500" : "bg-green-500"}`}
        >
          {me?.ready ? "בטל Ready" : "Ready"}
        </button>
      )}

      {!everyoneReady && me?.isHost && (
        <div className="text-gray-400 text-sm mt-2">
          כל השחקנים חייבים ללחוץ Ready
        </div>
      )}
    </div>
  );
}
