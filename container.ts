import mongoose from 'mongoose';

import { GridfsMediaStorage, MediaService } from '@/modules/media';
import { isMediaUsed } from '@/modules/post';

let mediaService: MediaService;

export function initializeServices() {
  const { db } = mongoose.connection;

  if (!db) {
    throw new Error('MongoDB is not connected');
  }

  const mediaStorage = new GridfsMediaStorage(db);

  mediaService = new MediaService(mediaStorage, isMediaUsed);
}

export function getMediaService() {
  if (!mediaService) {
    throw new Error('MediaService has not been initialized');
  }

  return mediaService;
}
