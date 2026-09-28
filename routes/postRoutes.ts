import express from 'express';

import * as postController from '../controllers/postController';
import validateBody from '../middleware/validateBody';
import { createPostSchema, updatePostSchema } from '../validators/postValidator';

const router = express.Router();

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
