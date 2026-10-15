import express from 'express';
import { createPostSchema, updatePostSchema } from '@nikivils/grimoire-contracts';

import * as postController from './post.controller';
import validateBody from '../../../../middleware/validateBody';
import commentRouter from '../../../../routes/commentRoutes';

const router = express.Router();

router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(validateBody(createPostSchema), postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(validateBody(updatePostSchema), postController.updatePost)
  .delete(postController.deletePost);

export default router;
