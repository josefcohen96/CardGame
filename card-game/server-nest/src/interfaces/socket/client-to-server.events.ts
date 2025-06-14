import { GameType } from '../game/game-type.enum';

export interface ClientToServerEvents {
  /* Room flow */
  'join-room':   (payload: { roomId: string; playerName: string; gameType: GameType }) => void;
  'leave-room':  (payload: { roomId: string }) => void;
  'toggle-ready':(payload: { roomId: string; playerId: string }) => void;
  'start-game':  (payload: { roomId: string; playerId: string }) => void;

  /* During the match */
  'game-move':   (payload: { gameId: string; move: any }) => void;

  /* Lobby list */
  'get-rooms':   () => void;
}
