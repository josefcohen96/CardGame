import { useEffect } from "react";
import socketManager from "../services/socketManager";
import type { ServerToClientEvents } from "../types/socket";

export function useSocket<Event extends keyof ServerToClientEvents>(
  event: Event,
  handler: ServerToClientEvents[Event]
) {
  useEffect(() => {
    const socket = socketManager.connect();
    socket.on(event, handler as any);

    return () => {
      socket.off(event, handler as any);
    };
  }, [event, handler]);
}