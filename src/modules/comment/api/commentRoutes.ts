import express from 'express';
import { createCommentSchema } from '@nikivils/grimoire-contracts';

import { validateBody } from '@/shared/middleware';

import * as commentController from './commentController';

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(commentController.getComments)
  .post(validateBody(createCommentSchema), commentController.createComment);

export default router;
