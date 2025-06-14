import { Module }        from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RoomEvents }    from './events/room.events';
import { GameEvents }    from './events/game.events';
import { GameModule }    from '../api/game/game.module';
import { RoomModule }    from '../api/room/room.module';

@Module({
  imports:   [GameModule, RoomModule],   // בשביל GameService & RoomService
  providers: [SocketGateway, RoomEvents, GameEvents],
  exports:   [SocketGateway],            // למקרה שמודול אחר ירצה להזריק Gateway
})
export class SocketsModule {}
