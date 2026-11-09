import type { CreatePostRequest } from '@nikivils/grimoire-contracts';

export interface Post {
  id: string;

  title: string;
  overview: string;

  cover: CreatePostRequest['cover'];
  content: CreatePostRequest['content'];
  tags: string[];

  status: 'draft' | 'published';
  publishedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type CreatePostData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePostData = Partial<
  Pick<Post, 'title' | 'overview' | 'cover' | 'content' | 'tags' | 'status' | 'publishedAt'>
>;
