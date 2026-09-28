import express from 'express';

import * as commentController from '../controllers/commentController';

import validateBody from '../middleware/validateBody';

import { createCommentSchema } from '../validators/commentValidator';

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(commentController.getComments)
  .post(validateBody(createCommentSchema), commentController.createComment);

export default router;
