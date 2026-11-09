import type { PostDto, PostSummaryDto } from '@nikivils/grimoire-contracts';

import { Post } from '@/modules/post/domain/post.types';

export const toPostDto = (post: Post): PostDto => ({
  id: post.id,

  title: post.title,
  overview: post.overview,

  cover: post.cover,
  content: post.content,
  tags: post.tags,

  status: post.status,
  publishedAt: post.publishedAt?.toISOString() ?? null,

  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
});

export const toPostSummaryDto = (post: Post): PostSummaryDto => ({
  id: post.id,

  title: post.title,
  overview: post.overview,

  cover: post.cover,
  tags: post.tags,

  publishedAt: post.publishedAt?.toISOString() ?? null,
  createdAt: post.createdAt.toISOString(),
});
