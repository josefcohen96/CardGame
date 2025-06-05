import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { WarGame } from '../games/war/WarGame';
import { WarCardValueStrategy } from '../games/war/WarCardValueStrategy';
import { Player } from '../entities/Player';
import { Deck } from '../entities/Deck';

@Injectable()
export class GameService {
  private redis = new Redis();
  private games: Map<string, WarGame> = new Map();


}
