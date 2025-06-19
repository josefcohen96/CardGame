import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RoomEvents } from './events/room.events';
import { GameEvents } from './events/game.events';
import { GameService } from '../api/game/game.service';
import { SocketEmitterService } from './socket-emitter.service';

@Module({
  providers: [
    SocketGateway,
    RoomEvents,
    GameEvents,
    GameService,
    SocketEmitterService, // ← חובה!
  ],
})
export class SocketsModule {}