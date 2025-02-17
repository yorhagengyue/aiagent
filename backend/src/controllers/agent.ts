import { Request, Response } from 'express';
import { AgentService } from '../services/agent';

export class AgentController {
  private agentService: AgentService;

  constructor(agentService: AgentService) {
    this.agentService = agentService;
  }

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { task, apiKey, model, headless } = req.body;
      const result = await this.agentService.createTask(task, apiKey, model, headless);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getTaskStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const status = await this.agentService.getTaskStatus(id);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getTaskResults = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.agentService.getTaskResults(id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
