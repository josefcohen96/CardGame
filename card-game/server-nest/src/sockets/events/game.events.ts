import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameEvents {
  startGame(data: { roomId: string }, client: Socket) {
    // לוגיקה לאתחול משחק (למשל, לשמור/להחזיר מצב משחק התחלתי)
    client.to(data.roomId).emit('game-started');
    client.emit('game-started');
  }

  onGameMove(data: any, client: Socket) {
    // ביצוע מהלך, עדכון מצב המשחק וכו'
    // לדוג׳:
    // client.to(data.roomId).emit('game-update', {...});
  }
}
