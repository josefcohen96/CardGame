import { GameType } from '../game/game-type.enum';
import { RoomPlayer } from '../room/room-player.interface';

export interface Room {
  id: string;
  type: GameType;
  maxPlayers: number;
  gameStarted: boolean;
  players: RoomPlayer[];
}
