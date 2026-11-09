import PostModel from './post.model';

import type { PostRepository } from '../application/ports/postRepository.port';

import type { Post, CreatePostData, UpdatePostData } from '../domain/post.types';

import toPost from './post.mapper';

class MongoosePostRepository implements PostRepository {
  async create(data: CreatePostData): Promise<Post> {
    const doc = await PostModel.create(data);

    return toPost(doc);
  }

  async findById(id: string): Promise<Post | null> {
    const doc = await PostModel.findById(id);

    return doc ? toPost(doc) : null;
  }

  async findPublished(): Promise<Post[]> {
    const docs = await PostModel.find({
      status: 'published',
    }).sort({
      publishedAt: -1,
    });

    return docs.map(toPost);
  }

  async update(id: string, data: UpdatePostData): Promise<Post | null> {
    const doc = await PostModel.findById(id);

    if (!doc) {
      return null;
    }

    doc.set(data);

    await doc.save();

    return toPost(doc);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }

  async isMediaUsed(mediaId: string): Promise<boolean> {
    const exists = await PostModel.exists({
      $or: [{ 'cover.imageId': mediaId }, { 'content.blocks.imageId': mediaId }],
    });

    return exists !== null;
  }
}

export default MongoosePostRepository;
