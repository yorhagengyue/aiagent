import { ActionResult, AgentHistoryList } from '../types/agent';
import { WebSocketService } from './websocket';
import { PythonAgentService } from './python-agent';

export class AgentService {
  private tasks: Map<string, AgentHistoryList> = new Map();
  private wsService: WebSocketService;
  private pythonAgent: PythonAgentService;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.pythonAgent = new PythonAgentService(wsService);
  }

  async createTask(task: string, apiKey: string, model: string, headless: boolean): Promise<string> {
    const taskId = Math.random().toString(36).substring(7);
    this.tasks.set(taskId, { allResults: [], allModelOutputs: [] });

    try {
      // Emit initial status
      this.wsService.emitTaskUpdate(taskId, {
        isDone: false,
        extractedContent: 'Starting task execution...',
        includeInMemory: false
      });

      // Run Python agent
      await this.pythonAgent.runTask(taskId, task, apiKey);
      return taskId;
    } catch (error) {
      this.wsService.emitTaskUpdate(taskId, {
        isDone: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        includeInMemory: false
      });
      throw error;
    }
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
