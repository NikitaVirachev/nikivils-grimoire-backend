import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({
  postId: 1,
  createdAt: -1,
});

const Comment = model('Comment', commentSchema);

export default Comment;
