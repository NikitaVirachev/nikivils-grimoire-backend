import mongoose from 'mongoose';

import { GridfsMediaStorage, MediaService, assertMediaExist } from '@/modules/media';
import PostService, { isMediaUsed } from '@/modules/post';

let mediaService: MediaService;
let postService: PostService;

export function initializeServices() {
  const { db } = mongoose.connection;

  if (!db) {
    throw new Error('MongoDB is not connected');
  }

  const mediaStorage = new GridfsMediaStorage(db);

  mediaService = new MediaService(mediaStorage, isMediaUsed);

  postService = new PostService(assertMediaExist);
}

export function getMediaService() {
  if (!mediaService) {
    throw new Error('MediaService has not been initialized');
  }

  return mediaService;
}

export function getPostService() {
  if (!mediaService) {
    throw new Error('PostService has not been initialized');
  }

  return postService;
}
