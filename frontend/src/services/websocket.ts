import { io, Socket } from 'socket.io-client';
import { ActionResult } from '../types/agent';

interface TaskUpdate {
  taskId: string;
  result: ActionResult;
  timestamp: string;
}

interface TaskComplete {
  taskId: string;
  results: ActionResult[];
  timestamp: string;
}

export class WebSocketClient {
  private socket: Socket;
  private static instance: WebSocketClient;

  private constructor() {
    this.socket = io('/', {
      reconnectionDelayMax: 10000,
      transports: ['polling', 'websocket'],
      withCredentials: true,
      path: '/socket.io'
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  joinTask(taskId: string): void {
    this.socket.emit('join:task', taskId);
  }

  leaveTask(taskId: string): void {
    this.socket.emit('leave:task', taskId);
  }

  subscribeToTaskUpdates(_taskId: string, callback: (update: TaskUpdate) => void): void {
    this.socket.on('task:update', callback);
  }

  subscribeToTaskComplete(_taskId: string, callback: (complete: TaskComplete) => void): void {
    this.socket.on('task:complete', callback);
  }

  unsubscribeFromTaskUpdates(): void {
    this.socket.off('task:update');
  }

  unsubscribeFromTaskComplete(): void {
    this.socket.off('task:complete');
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}

export const wsClient = WebSocketClient.getInstance();
