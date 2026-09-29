import mongoose from 'mongoose';

import Post from '../../models/postModel';
import Media from '../../models/mediaModel';
import Comment from '../../models/commentModel';

import AppError from '../../utils/appError';

import type { CreatePostInput, UpdatePostInput } from '../../types/postModel.types';

const { Types } = mongoose;

const hasImageId = (value: unknown): value is { imageId: unknown } =>
  typeof value === 'object' && value !== null && 'imageId' in value && value.imageId != null;

const collectMediaIds = (cover: unknown, content: unknown): string[] => {
  const ids = new Set<string>();

  if (hasImageId(cover)) {
    ids.add(String(cover.imageId));
  }

  if (
    typeof content === 'object' &&
    content !== null &&
    'blocks' in content &&
    Array.isArray(content.blocks)
  ) {
    content.blocks.forEach((block) => {
      if (hasImageId(block)) {
        ids.add(String(block.imageId));
      }
    });
  }

  return [...ids];
};

const assertMediaExist = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) {
    return;
  }

  const invalidId = ids.find((id) => !Types.ObjectId.isValid(id));

  if (invalidId) {
    throw new AppError(`Invalid media ID: ${invalidId}`, 400);
  }

  const existingMediaCount = await Media.countDocuments({
    _id: {
      $in: ids,
    },
  });

  if (existingMediaCount !== ids.length) {
    throw new AppError('One or more media files do not exist', 404);
  }
};

class PostService {
  async create(input: CreatePostInput) {
    const mediaIds = collectMediaIds(input.cover, input.content);

    await assertMediaExist(mediaIds);

    const post = new Post({
      title: input.title,
      overview: input.overview,

      cover: input.cover ?? undefined,

      content: input.content ?? {
        version: 1,
        blocks: [],
      },

      tags: input.tags ?? [],

      status: input.status ?? 'draft',
    });

    if (post.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    return post;
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid post ID', 400);
    }

    const post = await Post.findById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async getPublished() {
    return Post.find({
      status: 'published',
    })
      .select('title overview cover tags publishedAt createdAt')
      .sort({
        publishedAt: -1,
      });
  }

  async update(id: string, input: UpdatePostInput) {
    const post = await this.getById(id);

    const wasPublished = post.status === 'published';

    if (input.title !== undefined) {
      post.title = input.title;
    }

    if (input.overview !== undefined) {
      post.overview = input.overview;
    }

    if (input.tags !== undefined) {
      post.tags = input.tags;
    }

    if (input.content !== undefined) {
      post.set('content', input.content);
    }

    if (input.cover !== undefined) {
      if (input.cover === null) {
        post.cover = undefined;
      } else {
        post.set('cover', input.cover);
      }
    }

    if (input.status !== undefined) {
      post.status = input.status;
    }

    const mediaIds = collectMediaIds(post.cover, post.content);

    await assertMediaExist(mediaIds);

    if (!wasPublished && post.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    return post;
  }

  async delete(id: string): Promise<void> {
    const post = await this.getById(id);

    await post.deleteOne();

    await Comment.deleteMany({
      postId: post._id,
    });
  }
}

export default PostService;
