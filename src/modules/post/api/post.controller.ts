import { getPostService } from '@/app/container';

import catchAsync from '@/shared/middleware/catchAsync';
import { toPostDto, toPostSummaryDto } from './post.mapper';

export const getAllPosts = catchAsync(async (req, res, next) => {
  const postService = getPostService();

  const posts = await postService.getPublished();

  res.status(200).json({
    status: 'success',

    results: posts.length,

    data: {
      posts: posts.map(toPostSummaryDto),
    },
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const postService = getPostService();

  const post = await postService.getById(req.params.id);

  res.status(200).json({
    status: 'success',

    data: {
      post: toPostDto(post),
    },
  });
});

export const createPost = catchAsync(async (req, res, next) => {
  const postService = getPostService();

  const newPost = await postService.create(req.body);

  res.status(201).json({
    status: 'success',

    data: {
      newPost: toPostDto(newPost),
    },
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const postService = getPostService();

  const post = await postService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',

    data: {
      post: toPostDto(post),
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const postService = getPostService();

  await postService.delete(req.params.id);

  res.status(204).send();
});
