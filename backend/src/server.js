import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/', (req, res) => {
  res.json({ message: 'Game Server API' });
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo back for now
    ws.send(`Server received: ${message}`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to game server' }));
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});