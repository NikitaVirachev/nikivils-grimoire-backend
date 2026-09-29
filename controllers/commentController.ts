import type { Request, Response, NextFunction } from 'express';

import CommentService from '../services/comment/commentService';

const commentService = new CommentService();

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await commentService.create(req.params.postId, req.body);

    res.status(201).json({
      status: 'success',

      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await commentService.getByPost(req.params.postId);

    res.status(200).json({
      status: 'success',

      results: comments.length,

      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};
