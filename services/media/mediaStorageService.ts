import type { Readable } from 'node:stream';

export type MediaStorageType = 'gridfs' | 's3' | 'r2';

export interface UploadFileInput {
  filename: string;
  stream: Readable;

  metadata?: Record<string, unknown>;
}

export interface StoredFile {
  storageKey: string;
  size: number;
}

export interface MediaStorageService {
  readonly type: MediaStorageType;

  upload(input: UploadFileInput): Promise<StoredFile>;

  createReadStream(storageKey: string): Readable;

  delete(storageKey: string): Promise<void>;
}
