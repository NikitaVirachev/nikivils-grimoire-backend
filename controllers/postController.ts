import PostService from '../services/post';
import catchAsync from '../utils/catchAsync';

const postService = new PostService();

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await postService.getPublished();

  res.status(200).json({
    status: 'success',

    results: posts.length,

    data: {
      posts,
    },
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const post = await postService.getById(req.params.id);

  res.status(200).json({
    status: 'success',

    data: {
      post,
    },
  });
});

export const createPost = catchAsync(async (req, res, next) => {
  const newPost = await postService.create(req.body);

  res.status(201).json({
    status: 'success',

    data: {
      newPost,
    },
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const post = await postService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',

    data: {
      post,
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  await postService.delete(req.params.id);

  res.status(204).send();
});
