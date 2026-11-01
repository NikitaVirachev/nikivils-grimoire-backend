import path from 'path';
import express from 'express';
import morgan from 'morgan';

import apiRouter from './routes';

import globalErrorHandler from './middleware/errorHandler';
import notFoundHandler from './middleware/notFoundHandler';
import env from './config/env';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Body parser
app.use(express.json());

// 2) Static files
const frontendDir: string = env.FRONTEND_DIR || path.join(__dirname, 'public');
app.use(express.static(frontendDir));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// 3) ROUTES
app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
