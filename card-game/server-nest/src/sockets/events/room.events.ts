import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameType } from 'src/interfaces/Interfaces';


interface PlayerState {
  id: string;
  name: string;
}

interface Room {
  id: string;
  type: GameType;
  maxPlayers: number;
  gameStarted: boolean;
  players: PlayerState[];
}

@Injectable()
export class RoomEvents {
  /** roomId → Room */
  private rooms: Record<string, Room> = {};

  joinRoom(
    data: { roomId: string; playerName: string; gameType: GameType },
    client: Socket,
  ) {
    const { roomId, playerName, gameType } = data;
    client.join(roomId);

    /* צור חדר חדש אם אינו קיים */
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = {
        id: roomId,
        type: gameType,
        maxPlayers: 4,
        gameStarted: false,
        players: [],
      };
    }

    const room = this.rooms[roomId];

    // add player to the room if not already present
    if (!room.players.find(p => p.id === client.id)) {
      room.players.push({ id: client.id, name: playerName });
    }

    this.emitPlayerList(roomId, client);
  }

  leaveRoom(data: { roomId: string }, client: Socket) {
    const { roomId } = data;
    client.leave(roomId);

    const room = this.rooms[roomId];
    if (!room) return;

    room.players = room.players.filter(p => p.id !== client.id);
    this.emitPlayerList(roomId, client);

    if (room.players.length === 0) delete this.rooms[roomId];
  }

  handleDisconnect(client: Socket) {
    for (const roomId of Object.keys(this.rooms)) {
      const room = this.rooms[roomId];
      const idx = room.players.findIndex(p => p.id === client.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        this.emitPlayerList(roomId, client);
        if (room.players.length === 0) delete this.rooms[roomId];
      }
    }
  }

  /* ---------- שליחת נתונים ---------- */

  /** שולח player-list לכל השחקנים בחדר + לשחקן שהפעיל */
  private emitPlayerList(roomId: string, client: Socket) {
    const list = this.rooms[roomId]?.players ?? [];
    client.to(roomId).emit('player-list', list);
    client.emit('player-list', list); // גם לשולח עצמו
  }

  /** החזרת רשימת כל החדרים ללקוח שביקש */
  getRooms(client: Socket) {
    const list = Object.values(this.rooms).map(r => ({
      id: r.id,
      type: r.type,          // ← war / durak …
      playerCount: r.players.length,
      maxPlayers: r.maxPlayers,
      gameStarted: r.gameStarted,
    }));
    client.emit('room-list', list);
  }
}
