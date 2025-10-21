import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/auth.routes.js';
import userRoutes from './Routes/user.routes.js';  // ✅ Changed from #Routes
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check BEFORE securityMiddleware
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    uptime: process.uptime() 
  });
});

// Apply Arcjet security to all OTHER routes
app.use(securityMiddleware);

// Routes
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.status(200).send('Hello from Acquisitions Service!');
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions Service API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested resource does not exist' 
  });
});

// Error Handler
app.use((err, req, res) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

export default app;
