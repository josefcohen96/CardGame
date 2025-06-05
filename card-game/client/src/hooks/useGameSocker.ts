// src/hooks/useGameSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useGameSocket(roomId: string, playerName: string) {
  const [gameState, setGameState] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.emit("join_room", { roomId, playerName });
    socket.on("room_state", setGameState);
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [roomId, playerName]);

  const playTurn = () => socketRef.current?.emit("play_turn", { roomId, playerName });

  return { gameState, playTurn };
}
