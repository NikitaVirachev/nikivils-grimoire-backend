import multer from 'multer';

const uploadMedia = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: Number(process.env.MAX_IMAGE_SIZE),
    files: 1,
  },
});

export default uploadMedia;
