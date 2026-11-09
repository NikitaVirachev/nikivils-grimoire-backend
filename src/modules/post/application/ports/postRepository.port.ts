import type { Post, CreatePostData, UpdatePostData } from '../../domain/post.types';

export interface PostRepository {
  create(data: CreatePostData): Promise<Post>;

  findById(id: string): Promise<Post | null>;

  findPublished(): Promise<Post[]>;

  update(id: string, data: UpdatePostData): Promise<Post | null>;

  deleteById(id: string): Promise<boolean>;

  isMediaUsed(mediaId: string): Promise<boolean>;
}
