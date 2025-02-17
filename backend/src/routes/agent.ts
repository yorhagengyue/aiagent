import express, { Router } from 'express';
import { AgentController } from '../controllers/agent';
import { WebSocketService } from '../services/websocket';
import { AgentService } from '../services/agent';

export const agentRouter = Router();

export const initializeRouter = (wsService: WebSocketService): Router => {
  const agentService = new AgentService(wsService);
  const controller = new AgentController(agentService);

  // Create a new task
  agentRouter.post('/task', controller.createTask);

  // Get task status
  agentRouter.get('/task/:id', controller.getTaskStatus);

  // Get task results
  agentRouter.get('/task/:id/results', controller.getTaskResults);

  // Error handling middleware
  agentRouter.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Route Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  return agentRouter;
};
agentRouter.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Route Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});
