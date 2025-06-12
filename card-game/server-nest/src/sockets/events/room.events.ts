// src/api/room/events/room.events.ts (דוגמה בסיסית)
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface RoomPlayer { id: string; name: string }
interface Room { id: string; type: string; players: RoomPlayer[]; maxPlayers: number; gameStarted: boolean }

@Injectable()
export class RoomEvents {
  private rooms = new Map<string, Room>();

  joinRoom({ roomId, playerName }: { roomId: string; playerName: string }, client: Socket) {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = { id: roomId, type: 'war', players: [], maxPlayers: 4, gameStarted: false };
      this.rooms.set(roomId, room);
    }

    // הוספת שחקן אם לא קיים
    if (!room.players.some(p => p.id === client.id)) {
      room.players.push({ id: client.id, name: playerName });
      client.join(roomId);
      console.log(`[${roomId}] + ${playerName}`);
    }

    // שליחת רשימת שחקנים לחדר
    client.to(roomId).emit('player-list', room.players);
    client.emit('player-list', room.players);   // גם לשחקן שנכנס

    // (אופציונלי) שליחת room-list לכל הלקוחות
    const roomList = Array.from(this.rooms.values()).map(r => ({
      id: r.id,
      type: r.type,
      playerCount: r.players.length,
      maxPlayers: r.maxPlayers,
      gameStarted: r.gameStarted,
    }));
    client.broadcast.emit('room-list', roomList);
  }

  leaveRoom({ roomId }: { roomId: string }, client: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== client.id);
    client.leave(roomId);

    // עדכון שחקנים
    client.to(roomId).emit('player-list', room.players);
    if (room.players.length === 0) this.rooms.delete(roomId);
  }
}
