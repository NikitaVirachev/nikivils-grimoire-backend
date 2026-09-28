import { Types } from 'mongoose';

import Comment from '../../models/commentModel';
import Post from '../../models/postModel';

import AppError from '../../utils/appError';
import { generateAnonymousName } from '../../utils/generateAnonymousName';

import type { CreateCommentInput } from '../../validators/commentValidator';

class CommentService {
  private async assertPostExists(postId: string): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new AppError('Invalid post ID', 400);
    }

    const objectId = new Types.ObjectId(postId);

    const postExists = await Post.exists({
      _id: objectId,
      status: 'published',
    });

    if (!postExists) {
      throw new AppError('Post not found', 404);
    }

    return objectId;
  }

  async create(postId: string, input: CreateCommentInput) {
    const postObjectId = await this.assertPostExists(postId);

    const authorName = input.authorName ?? generateAnonymousName();

    return Comment.create({
      postId: postObjectId,
      authorName,
      text: input.text,
    });
  }

  async getByPost(postId: string) {
    const postObjectId = await this.assertPostExists(postId);

    return Comment.find({
      postId: postObjectId,
    }).sort({
      createdAt: -1,
    });
  }
}

export default CommentService;
