import mongoose, { type InferSchemaType } from 'mongoose';

const { Schema, model } = mongoose;

const mediaSchema = new Schema(
  {
    storage: {
      type: String,
      required: true,
      enum: ['gridfs', 's3', 'r2'],
      default: 'gridfs',
    },

    storageKey: {
      type: String,
      required: true,
    },

    filename: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    width: {
      type: Number,
      min: 1,
    },

    height: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true }
);

export type Media = InferSchemaType<typeof mediaSchema>;

const Media = model('Media', mediaSchema);

export default Media;
