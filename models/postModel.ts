import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

import { PostBlock } from '../types/postModel.types';

const { Schema, model } = mongoose;

const BLOCK_TYPES = ['paragraph', 'heading', 'image', 'quote'] as const;

const blockSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: randomUUID,
    },
  },
  {
    _id: false,
    id: false,
    discriminatorKey: 'type',
  }
);

const paragraphBlockSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const headingBlockSchema = new Schema(
  {
    text: {
      type: String,
      requied: true,
      default: '',
    },

    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
    },
  },
  {
    _id: false,
  }
);

const imageBlockSchema = new Schema(
  {
    imageId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },

    alt: {
      type: String,
      trim: true,
      default: '',
    },

    caption: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const quoteBlockSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const contentSchema = new Schema(
  {
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    blocks: [
      {
        type: blockSchema,

        discriminators: {
          paragraph: paragraphBlockSchema,
          heading: headingBlockSchema,
          image: imageBlockSchema,
          quote: quoteBlockSchema,
        },
      },
    ],
  },
  { _id: false }
);

const coverSchema = new Schema(
  {
    imageId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },

    alt: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
      maxlength: 200,
    },

    overview: {
      type: String,
      required: [true, 'A post must have an overview'],
    },

    cover: {
      type: coverSchema,
      required: false,
    },

    content: {
      type: contentSchema,
      required: true,
      default: () => ({
        version: 1,
        blocks: [],
      }),
    },

    tags: [{ type: String, trim: true, lowercase: true }],

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ status: 1, publishedAt: -1 });

postSchema.path('content.blocks').validate({
  validator(blocks: PostBlock[]) {
    return blocks.every((block) => BLOCK_TYPES.includes(block.type));
  },

  message: 'Post contains unsupported block type',
});

const Post = model('Post', postSchema);

export default Post;
