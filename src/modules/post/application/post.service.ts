import type { CreatePostRequest, UpdatePostRequest } from '@nikivils/grimoire-contracts';

import AppError from '@/shared/errors/appError';

import type { PostRepository } from './ports/postRepository.port';
import type { AssertMediaExist } from './ports/mediaExistence.port';
import type { Post, UpdatePostData } from '../domain/post.types';

import collectMediaIds from './collectMediaIds';

class PostService {
  private readonly repository: PostRepository;

  private readonly assertMediaExist: AssertMediaExist;

  constructor(repository: PostRepository, assertMediaExist: AssertMediaExist) {
    this.repository = repository;
    this.assertMediaExist = assertMediaExist;
  }

  async create(input: CreatePostRequest): Promise<Post> {
    const mediaIds = collectMediaIds(input.cover, input.content);

    await this.assertMediaExist(mediaIds);

    const status = input.status ?? 'draft';

    return this.repository.create({
      title: input.title,
      overview: input.overview,
      cover: input.cover ?? null,
      content: input.content ?? {
        version: 1,
        blocks: [],
      },
      tags: input.tags ?? [],
      status,
      publishedAt: status === 'published' ? new Date() : null,
    });
  }

  async getById(id: string): Promise<Post> {
    const post = await this.repository.findById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async getPublished(): Promise<Post[]> {
    return this.repository.findPublished();
  }

  async update(id: string, input: UpdatePostRequest): Promise<Post> {
    const post = await this.getById(id);

    const nextCover = input.cover === undefined ? post.cover : input.cover;

    const nextContent = input.content ?? post.content;

    const mediaIds = collectMediaIds(nextCover, nextContent);

    await this.assertMediaExist(mediaIds);

    const changes: UpdatePostData = {};

    if (input.title !== undefined) {
      changes.title = input.title;
    }

    if (input.overview !== undefined) {
      changes.overview = input.overview;
    }

    if (input.cover !== undefined) {
      changes.cover = input.cover;
    }

    if (input.content !== undefined) {
      changes.content = input.content;
    }

    if (input.tags !== undefined) {
      changes.tags = input.tags;
    }

    if (input.status !== undefined) {
      changes.status = input.status;
    }

    const nextStatus = input.status ?? post.status;

    if (post.status !== 'published' && nextStatus === 'published' && !post.publishedAt) {
      changes.publishedAt = new Date();
    }

    const updated = await this.repository.update(id, changes);

    if (!updated) {
      throw new AppError('Post not found', 404);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.deleteById(id);

    if (!deleted) {
      throw new AppError('Post not found', 404);
    }

    // Удаление комментариев подключим отдельной зависимостью.
  }
}

export default PostService;
