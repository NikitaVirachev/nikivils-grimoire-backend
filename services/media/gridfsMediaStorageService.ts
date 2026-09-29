import mongoose from 'mongoose';
import { pipeline } from 'node:stream/promises';
import type { Readable } from 'node:stream';

import { MediaStorageService, UploadFileInput, StoredFile } from './mediaStorageService';

const { GridFSBucket, ObjectId } = mongoose.mongo;

class GridFsMediaStorageService implements MediaStorageService {
  readonly type = 'gridfs' as const;

  private readonly bucket: mongoose.mongo.GridFSBucket;

  constructor(db: mongoose.mongo.Db) {
    this.bucket = new GridFSBucket(db, { bucketName: 'media' });
  }

  async upload(input: UploadFileInput): Promise<StoredFile> {
    const uploadStream = this.bucket.openUploadStream(input.filename, {
      metadata: input.metadata,
    });

    await pipeline(input.stream, uploadStream);

    return {
      storageKey: uploadStream.id.toHexString(),

      size: uploadStream.length,
    };
  }

  createReadStream(storageKey: string): Readable {
    return this.bucket.openDownloadStream(this.toObjectId(storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    await this.bucket.delete(this.toObjectId(storageKey));
  }

  private toObjectId(storageKey: string) {
    if (!ObjectId.isValid(storageKey)) {
      throw new Error(`Invalid GridFS storage key: ${storageKey}`);
    }

    return new ObjectId(storageKey);
  }
}

export default GridFsMediaStorageService;
