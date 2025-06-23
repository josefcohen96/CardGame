import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GameType } from '../../interfaces';


interface CreateGameDto {
    type: GameType;
    players: string[];
}

interface PlayMoveDto {
    gameId: string;
    playerId: string;
    move: any;
}

@Controller('game')
export class GameController {
    // In-memory store for demo purposes
    private games: Record<string, any> = {};

    @Post('create')
    createGame(@Body() body: CreateGameDto) {
        const gameId = Math.random().toString(36).substr(2, 9);
        let game;
        if (body.type === 'war') {
            game = this.initWarGame(body.players);
        } else if (body.type === 'durak') {
            game = this.initDurakGame(body.players);
        } else {
            return { error: 'Unsupported game type' };
        }
        this.games[gameId] = { type: body.type, instance: game };
        return { gameId, type: body.type };
    }

    @Post('play')
    playMove(@Body() body: PlayMoveDto) {
        const wrapper = this.games[body.gameId];
        if (!wrapper) return { error: 'Game not found' };

        const game = wrapper.instance;
        const updatedState = game.playTurn(body.playerId, body.move);
        return updatedState;
    }

    @Get(':gameId')
    getGame(@Param('gameId') gameId: string) {
        const game = this.games[gameId];
        if (!game) return { error: 'Game not found' };
        return game;
    }

    // --- Game initialization stubs ---
    private initWarGame(players: string[]) {
        // TODO: Implement war game initialization
        if (players.length < 2) {
            return { error: 'At least two players are required for War' };
        }
        if (players.length > 4) {
            return { error: 'War supports up to 4 players' };
        }

        return { players, deck: [], state: 'not started' };
    }

    private initDurakGame(players: string[]) {
        // TODO: Implement durak game initialization
        return { players, deck: [], state: 'not started' };
    }
}