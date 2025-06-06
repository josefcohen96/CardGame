// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import socket from "../services/socketManager";
import RoomCard from "../components/RoomCard";
import GameFab from "../components/GameFab";
import { RoomInfo } from "../types/room";
import { useSocket } from "../hooks/useGameSocket";

export default function HomePage() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  useEffect(() => {
    socket.connect();
    socket.emit("get-rooms");

    return () => {
      socket.disconnect();
    };
  }, []);

  useSocket("room-list", setRooms as any);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-center mb-6">🎮 חדרים זמינים</h1>

      {rooms.length === 0 ? (
        <div className="text-center text-gray-500">אין חדרים זמינים כרגע</div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {/* כפתור צף ליצירת חדר חדש */}
      <GameFab />
    </div>
  );
}
