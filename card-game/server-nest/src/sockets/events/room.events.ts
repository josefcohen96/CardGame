import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameType } from '../../interfaces/Interfaces';      // enum שלך

/* ---------- טיפוסים ---------- */
export interface RoomPlayer {
  id: string;
  name: string;
  ready: boolean;
  isHost: boolean;
}
export interface Room {
  id: string;
  type: GameType;
  maxPlayers: number;
  gameStarted: boolean;
  players: RoomPlayer[];
}

@Injectable()
export class RoomEvents {
  private rooms: Record<string, Room> = {};

  /* ------------- חיבור / ניתוק ------------- */
  joinRoom(
    data: { roomId: string; playerName: string; gameType: GameType },
    client: Socket,
  ) {
    const { roomId, playerName, gameType } = data;
    let room = this.rooms[roomId];

    if (!room) {
      // יוצר חדר חדש ומסמן את השחקן הראשון כ־Host
      room = this.rooms[roomId] = {
        id: roomId,
        type: gameType,
        maxPlayers: 4,
        gameStarted: false,
        players: [],
      };
    }

    if (!room.players.find(p => p.id === client.id)) {
      room.players.push({
        id: client.id,
        name: playerName,
        ready: false,
        isHost: room.players.length === 0,   // this first player is the host
      });
    }
    client.join(roomId);
    this.broadcastRoom(roomId);
  }

  handleDisconnect(client: Socket) {
    for (const roomId of Object.keys(this.rooms)) {
      const room = this.rooms[roomId];
      const i = room.players.findIndex(p => p.id === client.id);
      if (i !== -1) {
        room.players.splice(i, 1);
        // the player was removed, check if the host was removed
        if (room.players.length && !room.players.some(p => p.isHost)) {
          room.players[0].isHost = true;
          room.players[0].ready = true; // reset host's ready status
        }
        if (!room.players.length) delete this.rooms[roomId];
        else this.broadcastRoom(roomId);
      }
    }
  }

  leaveRoom({ roomId }: { roomId: string }, client: Socket) {
    client.leave(roomId);
    this.handleDisconnect(client);
  }

  toggleReady(
    data: { roomId: string; playerId: string },
    client: Socket,
  ) {
    const room = this.rooms[data.roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === data.playerId);
    if (player) {
      player.ready = !player.ready;
      this.broadcastRoom(room.id);
    }
  }

  startGame({ roomId, playerId }: { roomId: string; playerId: string }, client: Socket) {
    const room = this.rooms[roomId];
    if (!room || room.gameStarted) return;

    const host = room.players.find(p => p.isHost);
    const everyoneReady = room.players.every(p => p.ready);

    if (host?.id === playerId && everyoneReady && room.players.length >= 2) {
      room.gameStarted = true;
      client.to(roomId).emit('game-started');
      client.emit('game-started');
    }
  }

  /* ------------- util ------------- */

  getRooms(client: Socket) {
    const list = Object.values(this.rooms).map(r => ({
      id: r.id,
      type: r.type,
      playerCount: r.players.length,
      maxPlayers: r.maxPlayers,
      gameStarted: r.gameStarted,
    }));
    client.emit('room-list', list);
  }

  private broadcastRoom(roomId: string) {
    const room = this.rooms[roomId];
    if (!room) return;

    const payload = {
      id: room.id,
      type: room.type,
      players: room.players,
      maxPlayers: room.maxPlayers,
      gameStarted: room.gameStarted,
    };
    (global as any).io.to(roomId).emit('room-update', payload);
  }
}
