import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';
import { GameType, Room, StartDto } from '../../interfaces';
import { Player } from '../../games/entities/Player';

/* helper להזרקה גלובלית של io */
declare global { var io: Socket['server']; }

@Injectable()
export class RoomEvents {
  private rooms: Record<string, Room> = {};

  constructor(private readonly gameService: GameService) { }

  /* -------- lobby actions -------- */

  joinRoom(
    { roomId, playerName, gameType }: { roomId: string; playerName: string; gameType: GameType },
    client: Socket,
  ) {
    let room = this.rooms[roomId];

    if (!room) {
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
        isHost: room.players.length === 0,
      });
    }

    client.join(roomId);
    this.broadcastRoom(roomId);
  }

  toggleReady({ roomId, playerId }: { roomId: string; playerId: string }) {
    const room = this.rooms[roomId];
    if (!room) return;
    const player = room.players.find(p => p.id === playerId);
    if (player && !player.isHost) {
      player.ready = !player.ready;
      this.broadcastRoom(roomId);
    }
  }

  startGame({ roomId, playerId }: StartDto) {
    const room = this.rooms[roomId];
    if (!room || room.gameStarted) return;

    const host = room.players.find(p => p.isHost);
    const everyoneReady = room.players.length >= 2 && room.players.every(p => p.ready || p.isHost);

    if (host?.id === playerId && everyoneReady) {
      /* 1. הפוך RoomPlayer ל-Player אמיתי */
      const players = room.players.map(p => new Player(p.name));
      /* 2. צור משחק */
      const { gameId, state } = this.gameService.createGame(players, room.type);

      room.gameStarted = true;

      /* 3. שדר מצב פתיחה + nav */
      global.io.to(roomId).emit('game-state', state);
      global.io.to(roomId).emit('game-started', { roomId, gameId });
    }
  }

  /* -------- disconnect / leave -------- */

  handleDisconnect(client: Socket) {
    for (const roomId of Object.keys(this.rooms)) {
      const room = this.rooms[roomId];
      const idx = room.players.findIndex(p => p.id === client.id);
      if (idx !== -1) {
        const [removed] = room.players.splice(idx, 1);

        if (removed.isHost && room.players.length) {
          room.players[0].isHost = true;
          room.players[0].ready = true;
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

  /* -------- utils -------- */

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
    global.io.to(roomId).emit('room-update', payload);
  }
}
