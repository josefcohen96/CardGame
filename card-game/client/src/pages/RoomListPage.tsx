import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketManager from "../services/socketManager";
import { useSocket } from "../hooks/useGameSocket";

type RoomInfo = { id: string; type: string; playerCount: number };

export default function RoomListPage() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socketManager.connect();
    socketManager.emit("get-rooms");

    return () => {
      socketManager.disconnect();
    };
  }, []);

  useSocket("room-list", setRooms);

  return (
    <div className="flex flex-col items-center mt-12">
      <h2 className="text-2xl mb-4">חדרים פעילים</h2>
      <ul className="w-full max-w-xl space-y-2">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow"
          >
            <div>
              <span className="font-bold">{room.id}</span> |{" "}
              <span>{room.type}</span>
            </div>
            <div>
              <span>שחקנים: {room.playerCount}</span>
              <button
                className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-800"
                onClick={() => navigate(`/lobby/${room.type}/${room.id}`)}
              >
                הצטרף
              </button>
            </div>
          </li>
        ))}
      </ul>
      {rooms.length === 0 && (
        <div className="mt-8 text-gray-500">אין חדרים זמינים כרגע.</div>
      )}
    </div>
  );
}
