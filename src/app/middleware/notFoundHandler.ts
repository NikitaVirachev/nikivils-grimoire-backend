import { NextFunction, Request, Response } from 'express';

import AppError from '@/shared/errors/appError';

const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export default notFoundHandler;
