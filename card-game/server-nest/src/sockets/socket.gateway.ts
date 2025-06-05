import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
    WebSocketServer
} from '@nestjs/websockets';
import { GameService } from '../games/game.service';
import { Player } from '../entities/Player';
import { GameType } from '../interfaces/Interfaces';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('SocketGateway');

    constructor(private readonly gameService: GameService) { }

    afterInit(server: Server) {
        this.logger.log('WebSocket initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('create_game')
    handleCreateGame(
        @MessageBody() data: { name: string; gameType: string },
        @ConnectedSocket() client: Socket
    ) {
        const player = new Player(data.name);

        if (!Object.values(GameType).includes(data.gameType as GameType)) {
            client.emit('error', `Invalid game type: ${data.gameType}`);
            return;
        }

        const gameId = this.gameService.createGame(player, data.gameType as GameType);
        client.join(gameId);
        client.emit('game_created', { gameId, playerId: player.id });
    }

    @SubscribeMessage('join_game')
    handleJoinGame(
        @MessageBody() data: { gameId: string; name: string },
        @ConnectedSocket() client: Socket
    ) {
        const player = new Player(data.name);
        const success = this.gameService.joinGame(data.gameId, player);
        if (success) {
            client.join(data.gameId);
            this.server.to(data.gameId).emit('player_joined', {
                playerName: data.name,
                playerId: player.id,
            });
        } else {
            client.emit('error', 'Failed to join game');
        }
    }

    @SubscribeMessage('play_turn')
    handlePlayTurn(
        @MessageBody() data: { gameId: string; playerId: string; move: any },
        @ConnectedSocket() client: Socket
    ) {
        try {
            this.gameService.playTurn(data.gameId, data.playerId, data.move);
            const state = this.gameService.getGameState(data.gameId);
            this.server.to(data.gameId).emit('state_update', state);
        } catch (err) {
            client.emit('error', err.message);
        }
    }
} 
