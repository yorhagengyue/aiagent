import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeRouter } from './routes/agent';
import { WebSocketService } from './services/websocket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Initialize WebSocket as singleton first
const wsService = WebSocketService.getInstance(httpServer);

// Initialize and use routes
app.use('/api/agent', initializeRouter(wsService));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
