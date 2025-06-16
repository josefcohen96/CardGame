import { Room } from '../room/room.interface';
import { ClientGameState } from '../game/client-game-state.interface';

export interface ServerToClientEvents {
  /* Lobby / room */
  'room-update': (room: Room) => void;
  'room-list':   (rooms: Room[]) => void;

  /* Game lifecycle */
  'game-started': (payload: { roomId: string; gameId: string }) => void;
  'game-state':   (state: ClientGameState) => void;

  /* Generic */
  connect?: () => void;
  disconnect?: () => void;
}
