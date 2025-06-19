// src/sockets/events/room.events.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameService } from '../../api/game/game.service';
import { GameType, Room, StartDto } from '../../interfaces';
import { Player } from '../../games/entities/Player';

declare global { var io: Socket['server']; }

@Injectable()
export class RoomEvents {
  private rooms: Record<string, Room> = {};
  private roomToGame: Record<string, string> = {};

  constructor(private readonly gameService: GameService) { }

  joinRoom(
    { roomId, playerName, gameType }: { roomId: string; playerName: string; gameType: GameType },
    client: Socket,
  ) {
    console.log(`[RoomEvents] joinRoom: client=${client.id}, roomId=${roomId}, name="${playerName}", gameType=${gameType}`);

    let room = this.rooms[roomId];
    if (!room) {
      room = this.rooms[roomId] = {
        id: roomId,
        type: gameType,
        maxPlayers: 4,
        gameStarted: false,
        players: [],
      };
      console.log(`[RoomEvents] Created new room: ${roomId}`);
    }

    if (!room.players.find(p => p.id === client.id)) {
      room.players.push({
        id: client.id,
        name: playerName,
        ready: false,
        isHost: room.players.length === 0,
      });
      console.log(`[RoomEvents] Added player ${playerName} (${client.id}) to room ${roomId}`);
    }

    client.join(roomId);
    console.log(`[RoomEvents] Client ${client.id} joined socket room ${roomId}`);

    this.broadcastRoom(roomId);
  }

  toggleReady({ roomId, playerId }: { roomId: string; playerId: string }) {
    console.log(`[RoomEvents] toggleReady: roomId=${roomId}, playerId=${playerId}`);
    const room = this.rooms[roomId];
    if (!room) {
      console.warn(`[RoomEvents] Room not found: ${roomId}`);
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (player && !player.isHost) {
      player.ready = !player.ready;
      console.log(`[RoomEvents] Player ${playerId} ready=${player.ready}`);
      this.broadcastRoom(roomId);
    } else {
      console.log(`[RoomEvents] toggleReady: host or unknown player, ignored`);
    }
  }

  startGame({ roomId, playerId }: StartDto) {
    console.log(`[RoomEvents] startGame: roomId=${roomId}, initiatedBy=${playerId}`);
    const room = this.rooms[roomId];
    if (!room) {
      console.warn(`[RoomEvents] startGame: room not found`);
      return;
    }
    if (room.gameStarted) {
      console.warn(`[RoomEvents] startGame: already started`);
      return;
    }

    const host = room.players.find(p => p.isHost);
    const everyoneReady = room.players.length >= 2 && room.players.every(p => p.ready || p.isHost);

    console.log(`[RoomEvents] Host=${host?.id}, everyoneReady=${everyoneReady}`);
    if (host?.id === playerId && everyoneReady) {
      const players = room.players.map(p => new Player(p.id, p.name));
      const { gameId, state } = this.gameService.createGame(players, room.type);

      this.roomToGame[roomId] = gameId;
      room.gameStarted = true;
      console.log(`[RoomEvents] Game started: gameId=${gameId}, room=${roomId}`);

      global.io.to(roomId).emit('game-state', state);
      console.log(`[RoomEvents] Emitted 'game-state' to room ${roomId}`, { state });
      global.io.to(roomId).emit('game-started', { roomId, gameId });
      console.log(`[RoomEvents] Emitted 'game-started' to room ${roomId}`);
    } else {
      console.warn(`[RoomEvents] startGame denied: not host or not everyone ready`);
    }
  }

  getGameIdForRoom(roomId: string): string | undefined {
    return this.roomToGame[roomId];
  }

  handleDisconnect(client: Socket) {
    console.log(`[RoomEvents] handleDisconnect: client=${client.id}`);
    for (const roomId of Object.keys(this.rooms)) {
      const room = this.rooms[roomId];
      const idx = room.players.findIndex(p => p.id === client.id);
      if (idx !== -1) {
        const [removed] = room.players.splice(idx, 1);
        console.log(`[RoomEvents] Removed player ${removed.id} from room ${roomId}`);

        if (removed.isHost && room.players.length) {
          room.players[0].isHost = true;
          room.players[0].ready = true;
          console.log(`[RoomEvents] New host of room ${roomId}: ${room.players[0].id}`);
        }

        if (!room.players.length) {
          delete this.rooms[roomId];
          delete this.roomToGame[roomId];
          console.log(`[RoomEvents] Deleted empty room ${roomId}`);
        } else {
          this.broadcastRoom(roomId);
        }
      }
    }
  }

  leaveRoom({ roomId }: { roomId: string }, client: Socket) {
    console.log(`[RoomEvents] leaveRoom: client=${client.id}, roomId=${roomId}`);
    client.leave(roomId);
    this.handleDisconnect(client);
  }

  getRooms(client: Socket) {
    console.log(`[RoomEvents] getRooms requested by client=${client.id}`);
    const list = Object.values(this.rooms).map(r => ({
      id: r.id,
      type: r.type,
      playerCount: r.players.length,
      maxPlayers: r.maxPlayers,
      gameStarted: r.gameStarted,
    }));
    client.emit('room-list', list);
    console.log(`[RoomEvents] Sent room-list to client=${client.id}`, { list });
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
    console.log(`[RoomEvents] broadcastRoom: emitted 'room-update' to ${roomId}`, { payload });
  }
}
