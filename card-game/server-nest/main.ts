import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// כל הלוגיקה של Socket.io (מהקוד שלך)
const rooms = new Map<string, any>();

function createRoom(id: string, type: string, maxPlayers = 4) {
  return {
    id,
    type,
    players: [],
    maxPlayers,
    gameStarted: false,
  };
}

function getRoomList() {
  return Array.from(rooms.values()).map(room => ({
    id: room.id,
    type: room.type,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameStarted: room.gameStarted,
  }));
}

function broadcastRooms(io: SocketIOServer) {
  io.emit("room-list", getRoomList());
}

async function bootstrap() {
  // 1. בנה את אפליקציית NestJS
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api'); 
  // 2. קבל את השרת HTTP מאחורי NestJS
  const expressApp = app.getHttpAdapter().getInstance();
  const server = createServer(expressApp);

  // 3. צור שרת Socket.io
  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  // 4. לוגיקת Socket.io
  io.on('connection', (socket) => {
    console.log('[Socket.io] client connected', socket.id);

    socket.on('join-game', (roomId, playerName) => {
      let room = rooms.get(roomId);
      if (!room) {
        // אפשר לקבל type מהפרונט או לדרוס כאן
        const roomType = "war";
        room = createRoom(roomId, roomType);
        rooms.set(roomId, room);
      }
      if (!room.players.some((p: any) => p.name === playerName)) {
        room.players.push({ id: socket.id, name: playerName });
        socket.join(roomId);
        console.log(`[Room ${roomId}] Player joined: ${playerName}`);
      }
      io.to(roomId).emit("player-list", room.players);
      broadcastRooms(io);
    });

    socket.on('start-game', (roomId) => {
      const room = rooms.get(roomId);
      if (!room || room.players.length < 2) return;
      room.gameStarted = true;
      io.to(roomId).emit("game-started");
      // כאן אפשר לשדר gameState ראשוני
    });

    socket.on('get-rooms', () => {
      socket.emit("room-list", getRoomList());
    });

    socket.on('disconnect', () => {
      for (const room of rooms.values()) {
        const idx = room.players.findIndex((p: any) => p.id === socket.id);
        if (idx !== -1) {
          const leftPlayer = room.players.splice(idx, 1)[0];
          console.log(`[Room ${room.id}] Player left: ${leftPlayer.name}`);
          io.to(room.id).emit("player-list", room.players);
          if (room.players.length === 0) {
            rooms.delete(room.id);
          }
        }
      }
      broadcastRooms(io);
    });
  });

  // 5. הפעל את השרת
  const port = process.env.PORT || 3000;
  await app.init(); // קריטי להפעיל את NestJS לפני ההאזנה
  server.listen(port, () => {
    console.log(`NestJS + Socket.io server running on http://localhost:${port}`);
  });
}

bootstrap();
