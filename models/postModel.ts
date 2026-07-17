import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'A post must have a title'] },
  overview: { type: String, required: [true, 'A overview must have a title'] },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
