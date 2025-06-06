// src/pages/CreateRoomPage.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gameConfigs, GameType } from "../types/game";

export default function CreateRoomPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as GameType | null;
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [numPlayers, setNumPlayers] = useState(2);

  if (!type || !(type in gameConfigs)) {
    return <div className="text-center text-red-500 mt-10">סוג המשחק לא נתמך</div>;
  }

  const config = gameConfigs[type];

  const handleCreate = () => {
    if (!roomName || !playerName) {
      alert("נא להזין שם חדר ושם שחקן");
      return;
    }
    // הוספה: נווט ללובי של החדר (השרת ייצור אותו)
    navigate(`/lobby/${type}/${roomName}?name=${playerName}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-10 space-y-4">
      <h2 className="text-xl font-bold text-center">
        {config.icon} יצירת חדר חדש - {config.label}
      </h2>

      <div>
        <label className="block text-sm mb-1">שם החדר</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">שם השחקן שלך</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">
          מספר משתתפים ({config.minPlayers}-{config.maxPlayers})
        </label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={numPlayers}
          min={config.minPlayers}
          max={config.maxPlayers}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
        onClick={handleCreate}
      >
        צור חדר
      </button>
    </div>
  );
}
