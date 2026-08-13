import Post from '../models/postModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({ status: 'success', data: { posts } });
});

export const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json({ status: 'success', data: { post } });
});

export const createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
