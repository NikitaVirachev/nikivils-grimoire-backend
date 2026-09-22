import sharp from 'sharp';

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export interface ValidatedImage {
  mimeType: string;
  extension: string;

  width: number;
  height: number;
}

const validateImageasync = async (buffer: Buffer): Promise<ValidatedImage> => {
  const { fileTypeFromBuffer } = await import('file-type');

  const detectedType = await fileTypeFromBuffer(buffer);

  if (!detectedType) {
    throw new Error('Unable to determine file type');
  }

  if (!ALLOWED_IMAGE_TYPES.has(detectedType.mime)) {
    throw new Error(`Unsupported image type: ${detectedType.mime}`);
  }

  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(buffer, {
      /*
       * Do not allow the image size to increase after unpacking.
       */
      limitInputPixels: Number(process.env.MAX_IMAGE_PIXELS),

      /*
       * We retain strict warning handling for untrusted files.
       */
      failOn: 'warning',
    }).metadata();
  } catch {
    throw new Error('Invalid or corrupted image');
  }

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to determine image dimensions');
  }

  /*
   * Sharp also determines the actual MIME type.
   * We verify that the results of the two independent mechanisms
   * do not contradict each other.
   */
  if (metadata.mediaType && metadata.mediaType !== detectedType.mime) {
    throw new Error('Image type does not match its contents');
  }

  /*
   * Standard width and height do not take EXIF orientation into accaunt.
   *
   * For example, a photograph might physically be 4000x3000
   * but be displayed as 3000x4000.
   */
  const width = metadata.autoOrient?.width ?? metadata.width;

  const height = metadata.autoOrient?.height ?? metadata.height;

  return {
    mimeType: detectedType.mime,
    extension: detectedType.ext,

    width,
    height,
  };
};

export default validateImageasync;
