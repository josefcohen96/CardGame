import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface PlayerState {
  id: string;
  name: string;
}

@Injectable()
export class RoomEvents {
  private rooms: Record<string, PlayerState[]> = {};

  handleDisconnect(client: Socket) {
    for (const roomId of Object.keys(this.rooms)) {
      const index = this.rooms[roomId].findIndex(p => p.id === client.id);
      if (index !== -1) {
        this.rooms[roomId].splice(index, 1);
        this.emitPlayerList(roomId, client);
        if (this.rooms[roomId].length === 0) delete this.rooms[roomId];
      }
    }
  }

  joinRoom(data: { roomId: string; playerName: string }, client: Socket) {
    const { roomId, playerName } = data;
    client.join(roomId);

    if (!this.rooms[roomId]) this.rooms[roomId] = [];

    // אם המשתמש כבר קיים - אל תוסיף שוב
    if (!this.rooms[roomId].find(p => p.id === client.id)) {
      this.rooms[roomId].push({
        id: client.id,
        name: playerName,
      });
    }

    // שלח לכל השחקנים את רשימת השחקנים המעודכנת
    this.emitPlayerList(roomId, client);
  }

  leaveRoom(data: { roomId: string }, client: Socket) {
    const { roomId } = data;
    client.leave(roomId);
    if (this.rooms[roomId]) {
      this.rooms[roomId] = this.rooms[roomId].filter(p => p.id !== client.id);
      this.emitPlayerList(roomId, client);
    }
  }

  emitPlayerList(roomId: string, client: Socket) {
    const playerList = this.rooms[roomId] || [];
    client.to(roomId).emit('player-list', playerList);
    client.emit('player-list', playerList); // לשלוח גם לעצמי
  }

  getRooms(client: Socket) {
    const list = Object.keys(this.rooms).map(id => ({
      id,
      type: 'generic',
      playerCount: this.rooms[id].length,
    }));
    client.emit('room-list', list);
  }
}