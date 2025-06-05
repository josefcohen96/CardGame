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
} from '@nestjs/websockets';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('SocketGateway');

    afterInit(server: Server) {
        this.logger.log('WebSocket initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ): void {
        this.logger.log(`Received message from ${client.id}: ${JSON.stringify(data)}`);
        client.emit('message', data);
    }
}