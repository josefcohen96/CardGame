import { Room }       from '../room/room.interface';
import { GameState }  from '../game/game-state.interface';

export interface ServerToClientEvents {
  /* Lobby / room */
  'room-update': (room: Room) => void;
  'room-list':   (rooms: Room[]) => void;

  /* Game lifecycle */
  'game-started': (payload: { roomId: string; gameId: string }) => void;
  'game-state':   (state: GameState) => void;

  /* Generic */
  connect?: () => void;          // socket.io built-in – לא חובה להצהיר
  disconnect?: () => void;
}
