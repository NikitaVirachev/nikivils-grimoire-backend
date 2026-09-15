import type { Request, Response, NextFunction } from 'express';

import { pipeline } from 'node:stream/promises';

import { getMediaService } from '../container';

export const createMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

      claimedMimeType: req.file.mimetype,

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
  } catch (error) {
    next(error);
  }
};

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

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mediaService = getMediaService();

    const deleted = await mediaService.delete(req.params.id);

    if (!deleted) {
      res.status(404).json({
        status: 'fail',
        message: 'Media not found',
      });

      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
