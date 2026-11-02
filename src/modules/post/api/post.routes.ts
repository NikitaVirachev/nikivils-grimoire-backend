import express from 'express';
import { createPostSchema, updatePostSchema } from '@nikivils/grimoire-contracts';

import validateBody from '@/shared/middleware/validateBody';
import validateParams from '@/shared/middleware/validateParams';
import postParamsSchema from './post.validation';
import * as postController from './post.controller';

const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(validateBody(createPostSchema), postController.createPost);

router
  .route('/:id')
  .all(validateParams(postParamsSchema))
  .get(postController.getPost)
  .patch(validateBody(updatePostSchema), postController.updatePost)
  .delete(postController.deletePost);

export default router;
