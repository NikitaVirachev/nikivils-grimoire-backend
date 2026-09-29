import type { Request, Response, NextFunction } from 'express';

import { pipeline } from 'node:stream/promises';

import { getMediaService } from '../container';
import catchAsync from '../utils/catchAsync';

export const createMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({
      status: 'fail',
      message: 'File is required',
    });

    return;
  }

  const mediaService = getMediaService();

  const media = await mediaService.create({
    filename: req.file.originalname,

    buffer: req.file.buffer,
  });

  res.status(201).json({
    status: 'success',

    data: {
      media: {
        id: media._id,

        filename: media.filename,

        mimeType: media.mimeType,

        size: media.size,

        width: media.width,

        height: media.height,
      },
    },
  });
});

export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mediaService = getMediaService();

    const result = await mediaService.getFile(req.params.id);

    if (!result) {
      res.status(404).json({
        status: 'fail',
        message: 'Media not found',
      });

      return;
    }

    const { media, stream } = result;

    res.setHeader('Content-Type', media.mimeType);

    res.setHeader('Content-Length', media.size);

    res.setHeader('Cache-Control', 'public, max-age=86400');

    await pipeline(stream, res);
  } catch (error) {
    if (res.headersSent) {
      res.destroy();
      return;
    }

    next(error);
  }
};

export const deleteMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mediaService = getMediaService();

  await mediaService.delete(req.params.id);

  res.status(204).send();
});
