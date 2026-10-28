import type { Request, Response, NextFunction } from 'express';

import type { ZodType } from 'zod';

import AppError from '../../../utils/appError';

const validateParams = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.');

        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join('; ');

    return next(new AppError(message, 400));
  }

  req.body = result.data;

  next();
};

export default validateParams;
