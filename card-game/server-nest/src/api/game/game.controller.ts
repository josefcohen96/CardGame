import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GameType } from '../../interfaces';


interface CreateGameDto {
    type: GameType;
    players: string[];
}

interface PlayMoveDto {
    gameId: string;
    playerId: string;
    move: any; // Replace with specific move type per game
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
        this.games[gameId] = { type: body.type, state: game };
        return { gameId, type: body.type };
    }

    @Post('play')
    playMove(@Body() body: PlayMoveDto) {
        const game = this.games[body.gameId];
        if (!game) return { error: 'Game not found' };
        if (game.type === 'war') {
            // Implement war move logic here
            return { result: 'War move played (not implemented)' };
        } else if (game.type === 'durak') {
            // Implement durak move logic here
            return { result: 'Durak move played (not implemented)' };
        }
        return { error: 'Invalid game type' };
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