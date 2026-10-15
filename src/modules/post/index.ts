import PostService from './application/post.service';

export { default as postRouter } from './api/post.routes';
export { default as PostModel } from './infrastructure/post.model';
export default PostService;
