import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import airportRoutes from './routes/airports.js';
import fareRoutes from './routes/fares.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { specs } from './swagger.js';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(limiter);

app.get('/', (req, res) => {
  res.json({
    message: 'Ryanair API',
    version: packageJson.version,
    documentation: '/api-docs',
    endpoints: {
      airports: '/api/airports',
      fares: '/api/fares',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Ryanair API Documentation',
  })
);

app.use('/api/airports', airportRoutes);
app.use('/api/fares', fareRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app as default };
