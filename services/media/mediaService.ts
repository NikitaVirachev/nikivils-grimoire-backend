// services/media/media.service.ts

import type { Readable } from 'node:stream';
import { Types } from 'mongoose';

import Media from '../../models/mediaModel';
import type { MediaStorageService } from './mediaStorageService';

export interface CreateMediaInput {
  filename: string;
  mimeType: string;
  stream: Readable;

  width?: number;
  height?: number;
}

export class MediaService {
  private readonly storage: MediaStorageService;

  constructor(storage: MediaStorageService) {
    this.storage = storage;
  }

  async create(input: CreateMediaInput) {
    const storedFile = await this.storage.upload({
      filename: input.filename,
      stream: input.stream,

      metadata: {
        mimeType: input.mimeType,
      },
    });

    try {
      const media = await Media.create({
        storage: this.storage.type,

        storageKey: storedFile.storageKey,

        filename: input.filename,

        mimeType: input.mimeType,

        size: storedFile.size,

        width: input.width,

        height: input.height,
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
      return null;
    }

    return Media.findById(mediaId);
  }

  async getFile(mediaId: string) {
    const media = await this.get(mediaId);

    if (!media) {
      return null;
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
