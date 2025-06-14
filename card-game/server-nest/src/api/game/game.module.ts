// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from '../../games/game.service';
import { GameGateway } from '../../games/game.gateway';

@Module({
  providers: [GameService, GameGateway],
})
export class GameModule {}
