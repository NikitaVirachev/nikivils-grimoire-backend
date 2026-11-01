import multer from 'multer';

import env from '@/app/config/env';

const uploadMedia = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: Number(env.MAX_IMAGE_SIZE),
    files: 1,
  },
});

export default uploadMedia;
