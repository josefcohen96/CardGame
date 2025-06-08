import React from "react";
import { RoomInfo } from "../types/room";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  room: RoomInfo;
}

const RoomCard: React.FC<Props> = ({ room }) => {
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "";
  const navigate = useNavigate();

  const handleJoin = () => {

    navigate(`/lobby/${room.type}/${room.id}?name=${playerName}`);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow flex justify-between items-center">
      <div>
        <div className="text-lg font-bold">🏷️ {room.id}</div>
        <div className="text-sm text-gray-600">🎲 סוג המשחק: {room.type}</div>
        <div className="text-sm text-gray-600">
          👥 שחקנים: {room.playerCount} / {room.maxPlayers}
        </div>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
        onClick={handleJoin}
      >
        הצטרף
      </button>
    </div>
  );
};

export default RoomCard;
