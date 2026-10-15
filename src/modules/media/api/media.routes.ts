import express from 'express';

import * as mediaController from './media.controller';
import uploadMedia from '../../../../middleware/mediaUploadMiddleware';

const router = express.Router();

router.route('/').post(uploadMedia.single('file'), mediaController.createMedia);

router.route('/:id').get(mediaController.getMedia).delete(mediaController.deleteMedia);

export default router;
