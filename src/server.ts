// FarmLab API Server
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.config';
import { config } from './config';
import { publicRoutes, adminRoutes } from './routes';
import { postService } from './services';
import { seedDatabase } from './seeds';

const app = express();
const httpServer = createServer(app);

// CORS origins (support multiple)
const corsOrigins = config.corsOrigin.split(',').map(o => o.trim());

// Socket.IO with CORS
const io = new Server(httpServer, {
  cors: { 
    origin: corsOrigins, 
    methods: ['GET', 'POST'] 
  }
});

// Track active viewers
const activeViewers = new Set<string>();

// Middleware
app.use(cors({ 
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  activeViewers.add(socket.id);
  io.emit('viewerCount', activeViewers.size);

  socket.on('likePost', async ({ postId, sessionId }) => {
    try {
      const likes = await postService.likePost(postId, sessionId);
      io.emit('postLiked', { postId, likes });
    } catch (error) {
      console.error('Like error:', error);
    }
  });

  socket.on('disconnect', () => {
    activeViewers.delete(socket.id);
    io.emit('viewerCount', activeViewers.size);
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    
    httpServer.listen(config.port, () => {
      console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🌾 FarmLab API Server                              ║
  ║                                                      ║
  ║   🚀 API: http://localhost:${config.port}/api              ║
  ║   📦 MongoDB: Connected                              ║
  ║   🔗 CORS: ${corsOrigins.join(', ')}
  ║                                                      ║
  ║   Admin Login: admin / admin123                      ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
