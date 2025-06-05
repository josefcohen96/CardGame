import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/room' })
export class RoomEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() data: { roomId: string; userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(data.roomId);
        this.server.to(data.roomId).emit('userJoined', { userId: data.userId });
        return { event: 'joinedRoom', data: { roomId: data.roomId } };
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @MessageBody() data: { roomId: string; userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(data.roomId);
        this.server.to(data.roomId).emit('userLeft', { userId: data.userId });
        return { event: 'leftRoom', data: { roomId: data.roomId } };
    }
}