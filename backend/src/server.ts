import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import todoRoutes from './routes/todo.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Universal CORS for dev and prod
app.use(cors({
  origin: true,       // Allow requests from any origin
  credentials: true   // Allow cookies/auth headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');

  app.use(express.static(frontendPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

export default app;