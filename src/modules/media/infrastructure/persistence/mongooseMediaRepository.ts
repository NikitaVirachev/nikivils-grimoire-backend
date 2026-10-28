import { Types } from 'mongoose';

import MediaModel from '../media.model';

import type { MediaRepository } from '../../application/ports/mediaRepository.port';
import type { Media, CreateMediaData } from '../../domain/media.types';

function toMedia(doc: {
  _id: Types.ObjectId;
  storage: Media['storage'];
  storageKey: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
}): Media {
  return {
    id: doc._id.toString(),
    storage: doc.storage,
    storageKey: doc.storageKey,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    width: doc.width,
    height: doc.height,
  };
}

class MongooseMediaRepository implements MediaRepository {
  async create(data: CreateMediaData): Promise<Media> {
    const doc = await MediaModel.create(data);

    return toMedia(doc);
  }

  async findById(id: string): Promise<Media | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await MediaModel.findById(id);

    return doc ? toMedia(doc) : null;
  }

  async countByIds(ids: string[]): Promise<number> {
    return MediaModel.countDocuments({
      _id: { $in: ids },
    });
  }

  async deleteById(id: string): Promise<void> {
    await MediaModel.deleteOne({ _id: id });
  }
}

export default MongooseMediaRepository;
