import { Readable } from 'node:stream';

import type { MediaRepository } from './ports/mediaRepository.port';
import type { MediaStorage } from './ports/mediaStorage.port';
import type { IsMediaUsed } from './ports/mediaUsage.port';
import type { ImageInspector } from './ports/imageInspector.port';

import AppError from '../../../../utils/appError';

export interface CreateMediaInput {
  filename: string;
  buffer: Buffer;
}

export class MediaService {
  private readonly repository: MediaRepository;

  private readonly storage: MediaStorage;

  private readonly inspector: ImageInspector;

  private readonly isMediaUsed: IsMediaUsed;

  constructor(
    repository: MediaRepository,
    storage: MediaStorage,
    inspector: ImageInspector,
    isMediaUsed: IsMediaUsed
  ) {
    this.repository = repository;
    this.storage = storage;
    this.inspector = inspector;
    this.isMediaUsed = isMediaUsed;
  }

  async create(input: CreateMediaInput) {
    const validated = await this.inspector.inspect(input.buffer);

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
      const media = await this.repository.create({
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
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded media', {
          storageKey: storedFile.storageKey,
          storage: this.storage.type,
          originalError: error,
          cleanupError,
        });
      }

      throw error;
    }
  }

  async get(mediaId: string) {
    return this.repository.findById(mediaId);
  }

  async getFile(mediaId: string) {
    const media = await this.get(mediaId);

    if (!media) {
      throw new AppError('Media not found', 404);
    }

    if (media.storage !== this.storage.type) {
      throw new AppError(`Storage "${media.storage}" is not configured`, 500);
    }

    const stream = this.storage.createReadStream(media.storageKey);

    return {
      media,
      stream,
    };
  }

  async delete(mediaId: string): Promise<void> {
    const media = await this.repository.findById(mediaId);

    if (!media) {
      throw new AppError('Media not found', 404);
    }

    const isUsed = await this.isMediaUsed(mediaId);

    if (isUsed) {
      throw new AppError('Media is currently used by a post', 409);
    }

    if (media.storage !== this.storage.type) {
      throw new AppError(`Storage "${media.storage}" is not configured`, 500);
    }

    await this.storage.delete(media.storageKey);

    await this.repository.deleteById(media.id);
  }

  async assertExist(ids: string[]): Promise<void> {
    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length === 0) {
      return;
    }

    const count = await this.repository.countByIds(uniqueIds);

    if (count !== uniqueIds.length) {
      throw new AppError('One or more media files do not exist', 404);
    }
  }
}
