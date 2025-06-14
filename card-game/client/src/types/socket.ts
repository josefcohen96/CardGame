import { GameState } from "./game";
import { PlayerState } from "./player";

export interface ServerToClientEvents {
  "game-state": (state: GameState) => void;
  "player-list": (players: PlayerState[]) => void;
  "game-started": () => void;
  "room-list": (rooms: { id: string; type: string; playerCount: number }[]) => void;
}

export interface ClientToServerEvents {
  "join-room": (data: { roomId: string; playerName: string }) => void;
  "start-game": (roomId: string) => void;
  "get-rooms": () => void;
  "join-game": (data: { roomId: string; playerName: string }) => void;
  "game-move": (data: any) => void;
}
