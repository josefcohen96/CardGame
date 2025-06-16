// src/services/socketManager.ts
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  private constructor() { }

  /** מחזיר instance יחיד (Singleton) */
  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /** יצירת חיבור (או החזרת חיבור קיים) – מחזיר את ה-socket */
  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      this.socket = io('http://localhost:3000', {
        autoConnect: false,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => console.log('[Socket] Connected ✅'));
      this.socket.on('disconnect', () => console.log('[Socket] Disconnected ❌'));
      this.socket.on('connect_error', (err) => console.error('[Socket] Error:', err));
    }

    if (!this.socket.connected) {
      console.log('[Socket] Connecting…');
      this.socket.connect();
    }
    return this.socket;
  }

  /** Promise שמתממש ברגע שה-socket מחובר */
  async waitUntilConnected(): Promise<Socket> {
    const sock = this.connect();
    if (sock.connected) return sock;

    return new Promise((resolve) => {
      const onConnect = () => {
        sock.off('connect', onConnect);
        resolve(sock);
      };
      sock.on('connect', onConnect);
    });
  }

  /** ניתוק בטוח */
  disconnect() {
    if (this.socket?.connected) {
      console.log('[Socket] Disconnecting…');
      this.socket.disconnect();
    }
  }

  /* ---------- כלי עזר להרשמה / ביטול ---------- */

  on<E extends keyof ServerToClientEvents>(event: E, listener: ServerToClientEvents[E]) {
    console.log(`[Socket] on '${event}'`);
    this.socket?.on(event, listener as any);
  }

  once<E extends keyof ServerToClientEvents>(event: E, listener: ServerToClientEvents[E]) {
    console.log(`[Socket] once '${event}'`);
    this.socket?.once(event, listener as any);
  }

  off<E extends keyof ServerToClientEvents>(event: E, listener?: ServerToClientEvents[E]) {
    console.log(`[Socket] off '${event}'`);
    if (listener) this.socket?.off(event, listener as any);
    else this.socket?.off(event);
  }

  emit<E extends keyof ClientToServerEvents>(event: E, ...args: Parameters<ClientToServerEvents[E]>) {
    console.log(`[Socket] emit '${event}'`, args);
    this.socket?.emit(event, ...args);
  }

  isConnected() {
    return !!this.socket?.connected;
  }

  getSocket() {
    return this.socket!;
  }
}

export default SocketManager.getInstance();
