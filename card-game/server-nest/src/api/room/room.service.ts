import { Injectable, NotFoundException } from '@nestjs/common';
import { GameType, Room, RoomPlayer }    from '../../interfaces';

@Injectable()
export class RoomService {
  /** roomId → Room */
  private rooms = new Map<string, Room>();

  /** יצירת חדר חדש  */
  create(id: string, host: RoomPlayer, type: GameType, maxPlayers = 4): Room {
    if (this.rooms.has(id)) {
      throw new Error(`Room "${id}" already exists`);
    }

    const room: Room = {
      id,
      type,
      maxPlayers,
      gameStarted: false,
      players: [{ ...host, isHost: true, ready: false }],
    };

    this.rooms.set(id, room);
    return room;
  }

  /** החזרת חדר קיים (או שגיאה אם לא קיים) */
  get(id: string): Room {
    const room = this.rooms.get(id);
    if (!room) throw new NotFoundException(`Room "${id}" not found`);
    return room;
  }

  /** רשימת כל החדרים (ל־/rooms או room-list ב-socket) */
  list(): Room[] {
    return Array.from(this.rooms.values());
  }

  /** הוספת שחקן לחדר */
  join(id: string, player: RoomPlayer): Room {
    const room = this.get(id);

    if (room.players.find(p => p.id === player.id)) return room; // כבר בפנים
    if (room.players.length >= room.maxPlayers)     throw new Error('Room is full');

    room.players.push({ ...player, ready: false, isHost: false });
    return room;
  }

  /** יציאה של שחקן / ניתוק */
  leave(id: string, playerId: string): Room | undefined {
    const room = this.rooms.get(id);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== playerId);

    // אם המארח עזב – העבר את ה-host לשחקן הבא
    if (!room.players.some(p => p.isHost) && room.players.length) {
      room.players[0].isHost = true;
      room.players[0].ready  = false;
    }

    // אם אין אף אחד – מחק את החדר
    if (!room.players.length) {
      this.rooms.delete(id);
      return;
    }
    return room;
  }

  /** החלפת סטטוס Ready של שחקן */
  toggleReady(id: string, playerId: string): Room {
    const room   = this.get(id);
    const player = room.players.find(p => p.id === playerId);
    if (player) player.ready = !player.ready;
    return room;
  }

  /** סימון החדר כמופעל (המשחק התחיל) */
  markStarted(id: string) {
    const room = this.get(id);
    room.gameStarted = true;
  }
}
