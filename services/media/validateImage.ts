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

  return {
    mimeType: detectedType.mime,
    extension: detectedType.ext,
  };
};

export default validateImageasync;
