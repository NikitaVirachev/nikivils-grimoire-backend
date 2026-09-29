import mongoose from 'mongoose';

import { MediaService, GridFsMediaStorageService } from './services/media';

let mediaService: MediaService;

export function initializeServices() {
  const { db } = mongoose.connection;

  if (!db) {
    throw new Error('MongoDB is not connected');
  }

  const mediaStorage = new GridFsMediaStorageService(db);

  mediaService = new MediaService(mediaStorage);
}

export function getMediaService() {
  if (!mediaService) {
    throw new Error('MediaService has not been initialized');
  }

  return mediaService;
}
