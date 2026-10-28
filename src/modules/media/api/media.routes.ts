import express from 'express';

import { validateParams } from '@/shared/middleware';
import * as mediaController from './media.controller';
import uploadMedia from '../../../../middleware/mediaUploadMiddleware';
import mediaParamsSchema from './media.validation';

const router = express.Router();

router.route('/').post(uploadMedia.single('file'), mediaController.createMedia);

router
  .route('/:id')
  .all(validateParams(mediaParamsSchema))
  .get(mediaController.getMedia)
  .delete(mediaController.deleteMedia);

export default router;
