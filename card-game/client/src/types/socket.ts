import { GameState } from "./game";
import { PlayerState } from "../games/gameInterfaces";
import { GameType } from "./game";

export interface ServerToClientEvents {
  "game-state": (
    state: GameState) => void;
  "player-list": (
    players: PlayerState[]) => void;
  "game-started": () => void;
  "room-list": (rooms: {
    id: string;
    type: string;
    playerCount: number
  }[]
  ) => void;
  'room-update': (room: {
    id: string;
    type: string;
    players: PlayerState[];
    maxPlayers: number;
    gameStarted: boolean;
  }) => void;
}

export interface ClientToServerEvents {
  "join-room": (
    data:
      {
        roomId: string;
        playerName: string,
        gameType: GameType
      }) => void;
  'start-game': (
    data: {
      roomId: string;
      playerId: string
    }) => void;
  'toggle-ready': (
    data: {
      roomId: string;
      playerId: string
    }) => void;
  "get-rooms": () => void;
  "join-game": (
    data: {
      roomId: string;
      playerName: string
    }) => void;
  "game-move": (
    data: any) => void;
}
