const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// מבנה נתונים גלובלי של חדרים
const rooms = new Map(); // Map<roomId, RoomObject>

// דוגמה לאובייקט חדר
function createRoom(id, type, maxPlayers = 4) {
  return {
    id,
    type,
    players: [], // { id, name }
    maxPlayers,
    gameStarted: false,
    // ... אפשר להוסיף עוד תכונות כאן
  };
}

io.on('connection', (socket) => {
  console.log('[Socket.io] client connected', socket.id);

  // הצטרפות/יצירת חדר
  socket.on('join-game', (roomId, playerName) => {
    let room = rooms.get(roomId);
    if (!room) {
      // סוג המשחק אפשר להעביר מהפרונט או לדחוף ל-join-game (פה מדגם לדוג')
      const roomType = "war"; // ברירת מחדל, לשדרג לקלוט מ-client
      room = createRoom(roomId, roomType);
      rooms.set(roomId, room);
    }

    // הוספת שחקן (אם לא קיים)
    if (!room.players.some(p => p.name === playerName)) {
      room.players.push({ id: socket.id, name: playerName });
      socket.join(roomId);
      console.log(`[Room ${roomId}] Player joined: ${playerName}`);
    }
    // שידור לכל החדר
    io.to(roomId).emit("player-list", room.players);
    // עידכון רשימת חדרים לכולם
    broadcastRooms();
  });

  // התחלת משחק
  socket.on('start-game', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length < 2) return;
    room.gameStarted = true;
    io.to(roomId).emit("game-started");
    // כאן אפשר לייצר ולשדר gameState ראשוני
  });

  // בקשת רשימת חדרים
  socket.on('get-rooms', () => {
    socket.emit("room-list", getRoomList());
  });

  // טיפול בניתוק
  socket.on('disconnect', () => {
    // מוציא את השחקן מכל החדרים
    for (const room of rooms.values()) {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        const leftPlayer = room.players.splice(idx, 1)[0];
        console.log(`[Room ${room.id}] Player left: ${leftPlayer.name}`);
        io.to(room.id).emit("player-list", room.players);
        // אם החדר ריק – מוחקים אותו
        if (room.players.length === 0) {
          rooms.delete(room.id);
        }
      }
    }
    broadcastRooms();
  });

  // אפשר להוסיף אירועים של game-state וכו' כאן
});

// מחזיר רשימה של כל החדרים (לא שולח שמות שחקנים)
function getRoomList() {
  return Array.from(rooms.values()).map(room => ({
    id: room.id,
    type: room.type,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameStarted: room.gameStarted,
  }));
}

// משדר לכולם את רשימת החדרים
function broadcastRooms() {
  io.emit("room-list", getRoomList());
}

server.listen(3000, () => {
  console.log('Socket.io server running on http://localhost:3000');
});
