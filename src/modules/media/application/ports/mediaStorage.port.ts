import type { Readable } from 'node:stream';

import type { MediaStorageType } from '../../domain/media.types';

export interface UploadFileInput {
  filename: string;
  stream: Readable;

  metadata?: Record<string, unknown>;
}

export interface StoredFile {
  storageKey: string;
  size: number;
}

export interface MediaStorage {
  readonly type: MediaStorageType;

  upload(input: UploadFileInput): Promise<StoredFile>;

  createReadStream(storageKey: string): Readable;

  delete(storageKey: string): Promise<void>;
}
