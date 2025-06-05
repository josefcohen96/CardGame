import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/game' })
export class GameEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        // Handle new client connection
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // Handle client disconnect
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinGame')
    handleJoinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        // Handle player joining a game
        // Example: client.join(data.roomId);
        this.server.to(data.roomId).emit('playerJoined', { playerId: client.id });
        return { status: 'joined', roomId: data.roomId };
    }

    @SubscribeMessage('playCard')
    handlePlayCard(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        // Handle playing a card
        this.server.to(data.roomId).emit('cardPlayed', { playerId: client.id, card: data.card });
        return { status: 'cardPlayed', card: data.card };
    }
}