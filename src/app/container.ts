import mongoose from 'mongoose';

import { GridfsMediaStorage, MediaService, MongooseMediaRepository } from '@/modules/media';
import PostService, { isMediaUsed } from '@/modules/post';

let mediaService: MediaService;
let postService: PostService;

export function initializeServices() {
  const { db } = mongoose.connection;

  if (!db) {
    throw new Error('MongoDB is not connected');
  }

  const mediaRepository = new MongooseMediaRepository();
  const mediaStorage = new GridfsMediaStorage(db);

  mediaService = new MediaService(mediaRepository, mediaStorage, isMediaUsed);

  postService = new PostService((ids) => mediaService.assertExist(ids));
}

export function getMediaService() {
  if (!mediaService) {
    throw new Error('MediaService has not been initialized');
  }

  return mediaService;
}

export function getPostService() {
  if (!postService) {
    throw new Error('PostService has not been initialized');
  }

  return postService;
}
