import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../services/socketManager";
import { useAuth } from "../context/AuthContext";
import { usePlayerName } from "../context/PlayerNameContext";
import { GameType } from "../types/game";
import { PlayerState } from "../types/player";
import PlayerList from "../components/PlayerList";

/* תצוגת שם / אייקון למשחק */
const GAME_TYPE_DISPLAY: Record<GameType, { name: string; icon: string }> = {
  [GameType.WAR]: { name: "מלחמה", icon: "⚔️" },
  [GameType.DURAK]: { name: "דוראק", icon: "🃏" },
};

/* ‏Room state שמגיע מה-backend */
type RoomState = {
  id: string;
  type: GameType;          // ← חשוב שיהיה GameType!
  maxPlayers: number;
  gameStarted: boolean;
  players: PlayerState[];  // ‎id, name, isHost, ready
};

export default function LobbyPage() {
  const { id: roomIdParam, type: typeParam } = useParams<{
    id: string;
    type: GameType;
  }>();

  /* אם אחד מהם חסר – מראה הודעה */
  if (!roomIdParam || !typeParam)
    return <div className="text-center mt-10">נתיב שגוי</div>;

  const navigate = useNavigate();

  /* שם-שחקן */
  const { user } = useAuth();
  const pn = usePlayerName();
  const playerName =
    user?.displayName ||
    pn.playerName ||
    localStorage.getItem("playerName") ||
    `שחקן${Math.floor(Math.random() * 1000)}`;

  /* state */
  const [room, setRoom] = useState<RoomState | null>(null);
  const [myId, setMyId] = useState<string>(""); // לעולם לא undefined

  /* ══════════ חיבור לחדר ══════════ */
  useEffect(() => {
    const sock = socket.connect();

    const handleConnect = () => {
      setMyId(sock.id ?? "");                        // <-- לא נותן ל-undefined לברוח
      sock.emit("join-room", {
        roomId: roomIdParam,
        playerName,
        gameType: typeParam,
      });
    };

    /* אחרי חיבור */
    if (sock.connected) handleConnect();
    else sock.once("connect", handleConnect);

    /* ---------- מאזינים ---------- */
    sock.on("room-update", (payload: Omit<RoomState, "type"> & { type: string }) => {
      // להפוך את payload.type ל-GameType
      const fixed: RoomState = { ...payload, type: payload.type as GameType };
      setRoom(fixed);
    });

    sock.on("game-started", () =>
      navigate(`/game/${typeParam}/${roomIdParam}`)
    );

    /* ---------- ניקוי ---------- */
    return () => {
      sock.off("connect", handleConnect);
      sock.off("room-update");
      sock.off("game-started");
      socket.disconnect();
    };
  }, [roomIdParam, typeParam, playerName, navigate]);

  /* אם עדיין לא קיבלנו room-update */
  if (!room) return <div className="text-center mt-10">טוען…</div>;

  /* נוחות */
  const me = room.players.find((p) => p.id === myId);
  const allReady =
    room.players.length >= 2 &&
    room.players
      .filter((p) => !p.isHost)        // ← מתעלמים מה-Host
      .every((p) => p.ready);
  const gameDisp = GAME_TYPE_DISPLAY[room.type] ?? { name: room.type, icon: "🎮" };

  /* ══════════ פעולות ══════════ */
  const toggleReady = () =>
    socket.emit("toggle-ready", { roomId: room.id, playerId: myId });

  const startGame = () =>
    socket.emit("start-game", { roomId: room.id, playerId: myId });

  /* ══════════ UI ══════════ */
  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      {/* כותרת */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-extrabold flex items-center gap-2">
          {gameDisp.icon} {gameDisp.name}
        </span>
        <span className="text-sm text-gray-600 mt-1">
          חדר <b>{room.id}</b> • {room.players.length}/{room.maxPlayers}
        </span>
      </div>

      {/* רשימת שחקנים */}
      <PlayerList players={room.players} />

      {/* כפתור לפי Host / Player */}
      {me?.isHost ? (
        <button
          disabled={!allReady}
          onClick={startGame}
          className="bg-blue-600 disabled:bg-blue-300 text-white px-8 py-2 rounded-xl shadow mt-6"
        >
          התחל משחק
        </button>
      ) : (
        <button
          onClick={toggleReady}
          className={`px-8 py-2 rounded-xl shadow mt-6 text-white
            ${me?.ready ? "bg-gray-500" : "bg-green-600"}`}
        >
          {me?.ready ? "בטל Ready" : "Ready"}
        </button>
      )}

      {!allReady && me?.isHost && (
        <div className="text-gray-400 text-sm mt-2">כל השחקנים חייבים להיות Ready</div>
      )}
    </div>
  );
}
