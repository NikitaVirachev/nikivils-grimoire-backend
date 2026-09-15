import express from 'express';
import multer from 'multer';

import * as mediaController from '../controllers/mediaController';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.route('/').post(upload.single('file'), mediaController.createMedia);

router.route('/:id').get(mediaController.getMedia).delete(mediaController.deleteMedia);

export default router;
