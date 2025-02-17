import { ActionResult, AgentHistoryList } from '../types/agent';
import { WebSocketService } from './websocket';

export class AgentService {
  private tasks: Map<string, AgentHistoryList> = new Map();
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
  }

  async createTask(task: string, apiKey: string, model: string, headless: boolean): Promise<string> {
    const taskId = Math.random().toString(36).substring(7);
    // Initialize empty history
    this.tasks.set(taskId, { allResults: [], allModelOutputs: [] });

    // Emit task creation event
    this.wsService.emitTaskUpdate(taskId, {
      isDone: false,
      extractedContent: 'Task created',
      includeInMemory: false
    });

    return taskId;
  }

  async getTaskStatus(taskId: string): Promise<{ status: string }> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return { status: 'running' }; // Placeholder for now
  }

  async getTaskResults(taskId: string): Promise<AgentHistoryList> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }
}
