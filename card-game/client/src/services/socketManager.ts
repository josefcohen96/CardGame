// src/services/socketManager.ts
import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "../types/socket";

class SocketManager {
    private static instance: SocketManager;
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    private constructor() { }

    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    connect() {
        if (!this.socket) {
            this.socket = io("http://localhost:3000", { autoConnect: false }); 
            this.socket.on("connect", () => console.log("[Socket] Connected ✅"));
            this.socket.on("disconnect", () => console.log("[Socket] Disconnected ❌"));
        }
        if (!this.socket.connected) {
            console.log("[Socket] Connecting...");
            this.socket.connect();
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket && this.socket.connected) {
            console.log("[Socket] Disconnecting...");
            this.socket.disconnect();
        }
    }

    on<Event extends keyof ServerToClientEvents>(
        event: Event,
        listener: ServerToClientEvents[Event]
    ) {
        console.log(`[Socket] Subscribing to event: '${event}'`);
        console.log(`[Socket] Listener:`, listener);
        this.socket?.on(event, listener as any);
    }

    off<Event extends keyof ServerToClientEvents>(
        event: Event,
        listener?: ServerToClientEvents[Event]
    ) {
        console.log(`[Socket] Unsubscribing from event: '${event}'`);
        if (listener) this.socket?.off(event, listener as any);
        else this.socket?.off(event);
    }

    emit<Event extends keyof ClientToServerEvents>(
        event: Event,
        ...args: Parameters<ClientToServerEvents[Event]>
    ) {
        console.log(`[Socket] Emitting event: '${event}'`, args);
        this.socket?.emit(event, ...args);
    }

    isConnected() {
        return !!this.socket?.connected;
    }
}

export default SocketManager.getInstance();
