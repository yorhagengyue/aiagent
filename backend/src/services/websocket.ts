import { Server } from 'socket.io';
import { ActionResult } from '../types/agent';
import { Server as HttpServer } from 'http';

export class WebSocketService {
  private io: Server;
  private static instance: WebSocketService;
  private taskRooms: Map<string, Set<string>> = new Map();

  private constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join:task', (taskId: string) => {
        console.log(`Client ${socket.id} joined task ${taskId}`);
        socket.join(`task:${taskId}`);

        if (!this.taskRooms.has(taskId)) {
          this.taskRooms.set(taskId, new Set());
        }
        this.taskRooms.get(taskId)?.add(socket.id);
      });

      socket.on('leave:task', (taskId: string) => {
        console.log(`Client ${socket.id} left task ${taskId}`);
        socket.leave(`task:${taskId}`);
        this.taskRooms.get(taskId)?.delete(socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.taskRooms.forEach((clients, taskId) => {
          if (clients.has(socket.id)) {
            clients.delete(socket.id);
            if (clients.size === 0) {
              this.taskRooms.delete(taskId);
            }
          }
        });
      });
    });
  }

  static getInstance(server?: HttpServer): WebSocketService {
    if (!WebSocketService.instance) {
      if (!server) {
        throw new Error('WebSocket service must be initialized with an HTTP server first');
      }
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  emitTaskUpdate(taskId: string, result: ActionResult): void {
    this.io.to(`task:${taskId}`).emit('task:update', {
      taskId,
      result,
      timestamp: new Date().toISOString()
    });
  }

  emitTaskComplete(taskId: string, results: ActionResult[]): void {
    this.io.to(`task:${taskId}`).emit('task:complete', {
      taskId,
      results,
      timestamp: new Date().toISOString()
    });
  }

  getActiveClients(taskId: string): number {
    return this.taskRooms.get(taskId)?.size || 0;
  }
}
