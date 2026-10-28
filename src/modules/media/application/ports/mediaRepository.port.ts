import type { Media, CreateMediaData } from '../../domain/media.types';

export interface MediaRepository {
  create(data: CreateMediaData): Promise<Media>;

  findById(id: string): Promise<Media | null>;

  countByIds(ids: string[]): Promise<number>;

  deleteById(id: string): Promise<void>;
}
