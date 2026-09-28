import mongoose from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: 'Invalid ObjectId',
});

const blockIdSchema = z.string().uuid('Invalid block ID');

const paragraphBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('paragraph'),

    text: z.string().max(50_000),
  })
  .strict();

const headingBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('heading'),

    text: z.string().max(1_000),

    level: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ]),
  })
  .strict();

const imageBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('image'),

    imageId: objectIdSchema,

    alt: z.string().max(1_000).default(''),

    caption: z.string().max(2_000).default(''),
  })
  .strict();

const quoteBlockSchema = z
  .object({
    id: blockIdSchema,

    type: z.literal('quote'),

    text: z.string().max(20_000),

    author: z.string().max(500).default(''),
  })
  .strict();

export const postBlockSchema = z.discriminatedUnion('type', [
  paragraphBlockSchema,
  headingBlockSchema,
  imageBlockSchema,
  quoteBlockSchema,
]);

export const postContentSchema = z
  .object({
    version: z.literal(1),

    blocks: z.array(postBlockSchema).max(1000),
  })
  .strict();

const coverSchema = z
  .object({
    imageId: objectIdSchema,

    alt: z.string().max(1_000).default(''),
  })
  .strict();

export const createPostSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),

    overview: z.string().trim().min(1, 'Overview is required').max(1000),

    cover: coverSchema.nullable().optional(),

    content: postContentSchema.default({
      version: 1,
      blocks: [],
    }),

    tags: z.array(z.string().trim().min(1).max(100)).max(50).default([]),

    status: z.enum(['draft', 'published']).default('draft'),
  })
  .strict();

export const updatePostSchema = createPostSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type PostContent = z.infer<typeof postContentSchema>;

export type PostBlock = z.infer<typeof postBlockSchema>;
