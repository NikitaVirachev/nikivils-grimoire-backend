import { Readable } from 'node:stream';
import { Types } from 'mongoose';

import Media from '../../models/mediaModel';
import type { MediaStorageService } from './mediaStorageService';
import validateImageasync from './validateImage';
import AppError from '../../utils/appError';

export interface CreateMediaInput {
  filename: string;
  buffer: Buffer;
}

export class MediaService {
  private readonly storage: MediaStorageService;

  constructor(storage: MediaStorageService) {
    this.storage = storage;
  }

  async create(input: CreateMediaInput) {
    const validated = await validateImageasync(input.buffer);

    const storedFile = await this.storage.upload({
      filename: input.filename,

      stream: Readable.from(input.buffer),

      metadata: {
        mimeType: validated.mimeType,

        width: validated.width,

        height: validated.height,
      },
    });

    try {
      const media = await Media.create({
        storage: this.storage.type,

        storageKey: storedFile.storageKey,

        filename: input.filename,

        mimeType: validated.mimeType,

        size: storedFile.size,

        width: validated.width,

        height: validated.height,
      });

      return media;
    } catch (error) {
      // GridFS-файл уже был создан,
      // но Media создать не удалось.
      //
      // Компенсируем операцию.
      try {
        await this.storage.delete(storedFile.storageKey);
      } catch {
        // logger.error(...)
      }

      throw error;
    }
  }

  async get(mediaId: string) {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new AppError('Invalid media ID', 400);
    }

    return Media.findById(mediaId);
  }

  async getFile(mediaId: string) {
    const media = await this.get(mediaId);

    if (!media) {
      throw new AppError('Media not found', 404);
    }

    if (media.storage !== this.storage.type) {
      throw new Error(`Storage "${media.storage}" is not configured`);
    }

    const stream = this.storage.createReadStream(media.storageKey);

    return {
      media,
      stream,
    };
  }

  async delete(mediaId: string): Promise<boolean> {
    const media = await this.get(mediaId);

    if (!media) {
      return false;
    }

    if (media.storage !== this.storage.type) {
      throw new Error(`Storage "${media.storage}" is not configured`);
    }

    await this.storage.delete(media.storageKey);

    await media.deleteOne();

    return true;
  }
}
