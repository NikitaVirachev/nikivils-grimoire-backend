import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

import AppError from '../utils/appError';

const normalizeError = (err: unknown): AppError => {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new AppError('Image must be smaller than 10 MB', 413);
    }

    return new AppError(err.message, 400);
  }

  if (err instanceof Error) {
    return new AppError(err.message, 500);
  }

  return new AppError('Something went wrong', 500);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send meddage to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 🔥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = normalizeError(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
