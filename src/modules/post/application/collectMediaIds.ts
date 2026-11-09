const hasImageId = (value: unknown): value is { imageId: unknown } =>
  typeof value === 'object' && value !== null && 'imageId' in value && value.imageId != null;

const collectMediaIds = (cover: unknown, content: unknown): string[] => {
  const ids = new Set<string>();

  if (hasImageId(cover)) {
    ids.add(String(cover.imageId));
  }

  if (
    typeof content === 'object' &&
    content !== null &&
    'blocks' in content &&
    Array.isArray(content.blocks)
  ) {
    content.blocks.forEach((block) => {
      if (hasImageId(block)) {
        ids.add(String(block.imageId));
      }
    });
  }

  return [...ids];
};

export default collectMediaIds;
