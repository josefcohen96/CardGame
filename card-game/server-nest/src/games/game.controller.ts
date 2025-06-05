import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * קבלת מצב המשחק הנוכחי
   * GET /game/:roomId/state
   */
  @Get(':roomId/state')
  getGameState(@Param('roomId') roomId: string) {
    const state = this.gameService.getGameState(roomId);
    if (!state) {
      throw new NotFoundException(`Room ${roomId} not found or game not initialized`);
    }
    return state;
  }

  /**
   * שליחת פעולה מצד שחקן
   * POST /game/:roomId/action
   */
  @Post(':roomId/action')
  playTurn(
    @Param('roomId') roomId: string,
    @Body() body: { playerId: string; action: any }
  ) {
    const { playerId, action } = body;
    if (!playerId || !action) {
      throw new BadRequestException('Missing playerId or action');
    }

    try {
      const result = this.gameService.playTurn(roomId, playerId, action);
      return { success: true, result };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
