// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';

import './index';


@Module({
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule { }
