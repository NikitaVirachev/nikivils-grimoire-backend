import express from 'express';
import { createCommentSchema } from '@nikivils/grimoire-contracts';

import * as commentController from '../controllers/commentController';

import validateBody from '../middleware/validateBody';

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(commentController.getComments)
  .post(validateBody(createCommentSchema), commentController.createComment);

export default router;
