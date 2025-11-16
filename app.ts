import path from 'path';
import express from 'express';
import morgan from 'morgan';
import globalErrorHandler from './controllers/errorController';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Body parser
app.use(express.json());

// 2) Static files
const frontendDir: string = process.env.FRONTEND_DIR || path.join(__dirname, 'public');
app.use(express.static(frontendDir));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use(globalErrorHandler);

export default app;
