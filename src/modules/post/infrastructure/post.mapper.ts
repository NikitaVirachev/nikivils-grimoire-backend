import { Types } from 'mongoose';
import { z } from 'zod';

import type { Post } from '../domain/post.types';
import PostModel from './post.model';

type PostDocument = ReturnType<typeof PostModel.hydrate>;

const blockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('paragraph'),
    id: z.string(),
    text: z.string(),
  }),

  z.object({
    type: z.literal('heading'),
    id: z.string(),
    text: z.string(),
    level: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ]),
  }),

  z.object({
    type: z.literal('image'),
    id: z.string(),
    imageId: z.instanceof(Types.ObjectId),
    alt: z.string(),
    caption: z.string(),
  }),

  z.object({
    type: z.literal('quote'),
    id: z.string(),
    text: z.string(),
    author: z.string(),
  }),
]);

const assertNever = (value: never): never => {
  throw new Error(`Unsupported post block: ${JSON.stringify(value)}`);
};

type MongoPostBlock = z.infer<typeof blockSchema>;

const toPostBlock = (block: MongoPostBlock): Post['content']['blocks'][number] => {
  switch (block.type) {
    case 'paragraph':
      return {
        id: block.id,
        type: 'paragraph',
        text: block.text,
      };

    case 'heading':
      return {
        id: block.id,
        type: 'heading',
        text: block.text,
        level: block.level,
      };

    case 'image':
      return {
        id: block.id,
        type: 'image',
        imageId: block.imageId.toHexString(),
        alt: block.alt,
        caption: block.caption,
      };

    case 'quote':
      return {
        id: block.id,
        type: 'quote',
        text: block.text,
        author: block.author,
      };

    default:
      return assertNever(block);
  }
};

const contentSchema = z.object({
  version: z.literal(1),
  blocks: z.array(blockSchema),
});

const toPostContent = (content: unknown): Post['content'] => {
  const parsed = contentSchema.parse(content);

  return {
    version: parsed.version,
    blocks: parsed.blocks.map(toPostBlock),
  };
};

const toPost = (doc: PostDocument): Post => {
  const raw = doc.toObject();

  return {
    id: doc._id.toString(),

    title: doc.title,
    overview: doc.overview,

    cover: raw.cover
      ? {
          imageId: raw.cover.imageId.toString(),
          alt: raw.cover.alt,
        }
      : null,

    content: toPostContent(raw.content),

    tags: [...doc.tags],

    status: doc.status,
    publishedAt: doc.publishedAt ?? null,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export default toPost;
