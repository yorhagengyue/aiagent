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
  origin: ['https://verify-aiagent-app-tunnel-rn7wrjgq.devinapps.com', 'https://verify-aiagent-app-tunnel-npz4mrmc.devinapps.com', 'https://verify-aiagent-app-tunnel-2fa2enei.devinapps.com', 'https://verify-aiagent-app-tunnel-rbcctlxs.devinapps.com', 'https://verify-aiagent-app-tunnel-joprux7p.devinapps.com', 'https://verify-aiagent-app-tunnel-y6ja5rku.devinapps.com', 'https://verify-aiagent-app-tunnel-dbejq1ym.devinapps.com', 'https://verify-aiagent-app-tunnel-8gpwwgey.devinapps.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'Accept', 'Connection', 'Cache-Control']
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
