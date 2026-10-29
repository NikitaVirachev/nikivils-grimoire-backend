import { Router } from 'express';

import { postRouter } from '@/modules/post';
import { mediaRouter } from '@/modules/media';
import { commentRouter } from '@/modules/comment';

const router = Router();

router.use('/posts/:postId/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/media', mediaRouter);

export default router;
